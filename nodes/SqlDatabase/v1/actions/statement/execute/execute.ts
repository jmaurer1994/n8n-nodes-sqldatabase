import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { WorkerPool, WorkerEvent, WorkerMessage } from '../../../transport';
import { initializeJvm } from '../../../transport/java';

export const SqlDatabaseNodeOptions = {} as any;

export async function execute(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const { user, password, jdbcUrl, driverDirectory, driverClass, maxConcurrentConnections } = await this.getCredentials('sqlDatabase');
  const outputOptions = this.getNodeParameter('additionalOptions', 0) as any;

  const workerData = {
    connection: {
      user,
      password,
      jdbcUrl
    }
  }
  const items = this.getInputData();

  let itemIndex = 0;
  const getTask = () => {
    if (itemIndex >= items.length) {
      return null
    }
    const statement = this.getNodeParameter('sqlStatement', itemIndex++);
    this.logger.debug(`item ${itemIndex} \n ${statement}`)
    return { statement, itemIndex }
  }

  return new Promise((resolve, reject) => {
    const numberOfWorkers = items.length < parseInt(maxConcurrentConnections as string) ? items.length : maxConcurrentConnections;

    const workerPool = new WorkerPool(numberOfWorkers);

    const results: any = []
    const processWorkerOutput = ({ columns, data, itemIndex }) => {
      const resultTarget: any[] = outputOptions.groupOutput ? results : [];

      for (let i = 0; i < data.length; i++) {
        const formattedRow = {}
        for (let j = 0; j < columns.length; j++) {
          formattedRow[columns[j].name] = data[i][j];
        }

        if (outputOptions.groupOutput) {
          resultTarget.push({ json: formattedRow, pairedItem: itemIndex });
        } else {
          resultTarget.push(formattedRow);
        }
      }

      if (!outputOptions.groupOutput) {
        results.push({ json: { result: resultTarget }, pairedItem: itemIndex });
      }
    }

    const handleWorkerMessage = ({ uuid, event, message }: WorkerMessage) => {
      switch (event) {
        case WorkerEvent.Registered:
          this.logger.debug(`[${event}]<${uuid}>: registered`);
          return;
        case WorkerEvent.Available:
          const task = getTask();

          if (task === null) {
            this.logger.debug("Queue empty, destroying pool")
            workerPool.destroyPool();
            resolve(results)
          }

          this.logger.debug(`[${event}]<${uuid}>: handling #${task?.itemIndex} \n${task?.statement}`);
          workerPool.dispatchTask(uuid, task);
          return;
        case WorkerEvent.TaskComplete:
          processWorkerOutput(message);
          return;
      }
    }

    this.logger.debug("Initializing workers @@@@@@@@@@@@@@@@@@@@@@@@@@@222")

    workerPool.initializeWorkers(workerData, handleWorkerMessage);
    this.logger.debug("initializing jvm @@@@@@@@@@@@@@@@@@@@@@")
    initializeJvm({ driverDirectory, driverClass });
    
  })
}



