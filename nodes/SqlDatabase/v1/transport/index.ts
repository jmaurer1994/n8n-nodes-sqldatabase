import { createWorkerPool } from './worker'
import { createStatementQueue } from './statement'
import { logger } from '../actions';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const executeStatementBatch = async (getStatement) => {

  const { dispatchTask, busyWorkerCount, destroyWorkerPool } = createWorkerPool();
  const { dequeueStatement } = createStatementQueue(getStatement);

  const statementBatchResults: any[] = [];
  const taskResults: Promise<any>[] = [];

  logger().log('debug', "Beginning execute statement batch process");
  do {
    const statement = dequeueStatement();
    if (statement.sql === null) {
      const busyWorkers = busyWorkerCount();
      if (busyWorkers > 0) {
        logger().log('debug', `Waiting for ${busyWorkers} worker to finish their task`);
        await sleep(100);
        continue;
      }
      logger().log('debug', "Finished processing all statements");
      break;
    }

    logger().log('debug', `Got item ${statement.itemIndex} from queue, dispatching for processing`);
    let taskResult = null as any;
    do {
      taskResult = dispatchTask(statement);
      if (taskResult === null) {
        //couldnt reserve another connection
        logger().log('debug', "Waiting for free connection to continue processing");
        await sleep(1000);
      }
    } while (taskResult === null);

    taskResults.push(taskResult);

    taskResult.then(rawResult => {
      logger().log('debug', `Storing result for item ${rawResult.itemIndex}`);
      statementBatchResults.push(rawResult);
    });
  } while (true);

  logger().log('debug', "Closing batch");
  destroyWorkerPool();
  return statementBatchResults;
}
