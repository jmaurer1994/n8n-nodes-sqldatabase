import * as java from './java'
import { createWorkerPool } from './worker'
import { createStatementQueue } from './statement'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const executeStatementBatch = async (javaOptions, connectionOptions, outputOptions, getStatement) => {
  const javaInstance = java.initializeJvm(javaOptions);

  javaInstance.import('java.sql.Types');

  const { dispatchTask, busyWorkerCount, destroyWorkerPool } = createWorkerPool(connectionOptions);
  const { dequeueStatement } = createStatementQueue(getStatement);

  const statementBatchResults: any[] = [];
  const taskResults: Promise<any>[] = [];

  console.log("Beginning batch process");
  do {
    const statement = dequeueStatement();
    if (statement === null) {
      const busyWorkers = busyWorkerCount();
      if (busyWorkers > 0) {
        console.log(`Waiting for ${busyWorkers} worker to finish their task`);
        await sleep(100);
        continue;
      }
      console.log("Finished processing statements");
      break;
    }
    console.log("Got statement from queue, dispatching for processing");

    const taskResult = dispatchTask(statement);
    if (taskResult === null) {
      //couldnt reserve another connection
      console.log("Waiting for free connection to continue processing");
      await sleep(1000);
      continue;
    }

    taskResults.push(taskResult);

    taskResult.then(rawResult => {
      console.log("Storing result");
      statementBatchResults.push(rawResult);
    });
  } while (true);

  console.log("Closing batch");
  destroyWorkerPool();
  return statementBatchResults;
}
