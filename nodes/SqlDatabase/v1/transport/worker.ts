import { v4 as uuidv4 } from 'uuid';
import { processStatement } from "./statement";
import { logger } from "../actions";
import { reserveConnection } from './connection';

export const createWorkerPool = (connectionOptions) => {
  const workerPool: any[] = [];
  let workerCount = 0;

  const spawnWorker = () => {
    const uuid = uuidv4();
    const connectionObject = reserveConnection(connectionOptions);
    workerCount++;

    return {
      uuid,
      connectionObject,
      handleTask: (statement) => processStatement(statement, connectionObject)
    }
  }

  return {
    dispatchTask: (statement) => {
      let worker;
      if (workerPool.length === 0) {
        if (workerCount === connectionOptions.maxConcurrentConnections) {
          return null;
        }
        worker = spawnWorker();
      } else {
        worker = workerPool.pop();
      }
      logger().debug(`<${worker.uuid}>: not free`);

      logger().verbose(`<worker:${worker.uuid }><statement:${statement.statementIndex}>: executing`);
      const processPromise = worker.handleTask(statement);

      processPromise.then(() => {
        logger().verbose(`<worker:${worker.uuid}><statement:${statement.statementIndex}>: complete`);
      }).catch((e) => {
        logger().error(`<worker:${worker.uuid}><statement:${statement.statementIndex}>: encountered error`);
      }).finally(() => {
        logger().debug(`<${worker.uuid}>: free`);
        workerPool.push(worker);
      })

      return processPromise;
    },
    busyWorkerCount: () => workerCount - workerPool.length,
    destroyWorkerPool: () => {
      while (workerPool.length > 0) {
        const worker = workerPool.pop();
        worker.connectionObject.close();
      }
      logger().debug("Laid off all workers");
    }
  }
}
