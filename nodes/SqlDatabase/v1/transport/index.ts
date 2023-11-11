import * as java from './java'
import { createWorkerPool } from './worker'
import { createStatementQueue } from './statement'
import { SqlDatabaseNodeOptions, logger } from '../actions/statement/execute/execute';


const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const executeStatementBatch = async (javaOptions, connectionOptions, getStatement) => {
  const javaInstance = java.initializeJvm(javaOptions);

  javaInstance.import('java.sql.Types');

  const { dispatchTask, busyWorkerCount, destroyWorkerPool } = createWorkerPool(connectionOptions);
  const { dequeueStatement } = createStatementQueue(getStatement);

  const statementBatchResults: any[] = [];
  const taskResults: Promise<any>[] = [];

  logger().debug("Beginning execute statement batch process");
  do {
    const statement = dequeueStatement();
    if (statement.sql === null) {
      const busyWorkers = busyWorkerCount();
      if (busyWorkers > 0) {
        logger().debug(`Waiting for ${busyWorkers} worker to finish their task`);
        await sleep(100);
        continue;
      }
      logger().debug("Finished processing all statements");
      break;
    }

    logger().debug(`Got item ${statement.itemIndex} from queue, dispatching for processing`);
    let taskResult = null as any;
    do {
      taskResult = dispatchTask(statement);
      if (taskResult === null) {
        //couldnt reserve another connection
        logger().debug("Waiting for free connection to continue processing");
        await sleep(1000);
      }
    } while (taskResult === null);

    taskResults.push(taskResult);

    taskResult.then(rawResult => {
      logger().verbose(`Storing result for item ${rawResult.itemIndex}`);
      statementBatchResults.push(rawResult);
    }).catch(e => {
      logger().error(`An error was encountered during task execution for statement ${ statement.itemIndex }\t\n${e}`);
      if(!SqlDatabaseNodeOptions.continueOnFail){
        throw e;
      }
      logger().verbose(`Continuing execution based on execution parameter`);
    });
  } while (true);

  logger().debug("Closing batch");
  destroyWorkerPool();
  return statementBatchResults;
}
