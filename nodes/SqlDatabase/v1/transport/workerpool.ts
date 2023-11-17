import { Worker, parentPort, isMainThread, workerData } from 'node:worker_threads';
import { v4 as uuidv4 } from 'uuid';
import { reserveConnection } from './connection';
import { createStatement, executeStatement } from './statement';
import { getResultSetMetadata, processResultSet } from './resultset';
import NodeJavaCore from 'java';

export enum PoolEvent {
  NewTask = 'pool:new_task',
  StopWorkers = 'pool:stop_workers',
}

export type PoolMessage = {
  event: PoolEvent,
  task?
}

type Uuid = string;

export class WorkerPool{
  workers: Map<Uuid, Worker> = new Map();
  maxWorkers;
  constructor(maxWorkers){
    this.maxWorkers = maxWorkers;
  }
  initializeWorkers(workerData, workerMessageHandler: WorkerMessageHandler){
    for (let i = 0; i < this.maxWorkers; i++) {
      workerData.uuid = uuidv4();
      console.log("==================================================")
      console.log("Initiaiziing worker")
      const worker = new Worker(__filename, workerData);
      worker.on('message', workerMessageHandler);

      this.workers.set(workerData.uuid, worker);
    }
  }
  dispatchTask(uuid, task) {
    if(!this.workers.has(uuid)){
      return false;
    }

    const worker = this.workers.get(uuid) as Worker;
    worker.postMessage({ event: PoolEvent.NewTask, task } as PoolMessage);
    return true;
  }
  destroyPool() {
    for (const [, worker] of this.workers) {
      worker.terminate();
    }
  }
  
}

export type WorkerMessageHandler = (workerMessage: WorkerMessage) => void


export enum WorkerEvent {
  Registered = 'worker:registered',
  Available = 'worker:available',
  TaskComplete = 'worker:task_complete',
  Error = 'worker:error'
}

export type WorkerMessage = {
  uuid: string,
  event: WorkerEvent,
  message?: any
}

if (!isMainThread) {
  /**
   * Worker starts here
   */
  console.log(`==========================================================================\n\t\t\tHIT WORKER ENTRY`)
  const { uuid, user, password, jdbcUrl } = workerData;

  parentPort!.postMessage({ uuid, event: WorkerEvent.Registered });
  let connectionObject = null;

  NodeJavaCore.registerClient(() => {
    parentPort!.postMessage({ uuid, event: WorkerEvent.Registered });
  }, () => {
    try {
      connectionObject = reserveConnection(user, password, jdbcUrl);
      parentPort!.postMessage({ uuid, event: WorkerEvent.Available });
    } catch (e) {
      parentPort!.postMessage({ uuid, event: WorkerEvent.Error, message: 'error creating connobj' });
    }
  })

  parentPort!.on('message', ({ event, task }: PoolMessage) => {
    switch (event) {
      case PoolEvent.NewTask:
        handleTask(task)
        return
    }
  })

  function handleTask({ statement, itemIndex }) {
    const statementObject = createStatement(connectionObject!);

    if (statementObject === null) {
      parentPort!.postMessage({ uuid, event: WorkerEvent.Error, message: 'Could not create statement' });
    }

    const resultSetObject = executeStatement(statement, statementObject!);


    if (resultSetObject === null) {
      parentPort!.postMessage({ uuid, event: WorkerEvent.Error, message: 'Could not execute statement' });
    }

    const resultSetMetaDataObject = getResultSetMetadata(resultSetObject!);

    if (resultSetMetaDataObject === null) {
      parentPort!.postMessage({ uuid, event: WorkerEvent.Error, message: 'Could not get resultset metadata' });
    }
    const result = processResultSet(resultSetMetaDataObject!, resultSetObject!);

    if (result === null) {
      parentPort!.postMessage({ uuid, event: WorkerEvent.Error, message: 'Could not process resultset' });
    }

    parentPort!.postMessage({ uuid, event: WorkerEvent.TaskComplete, message: { ...result, itemIndex } });
  }
}