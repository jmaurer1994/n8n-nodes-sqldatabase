import { getJavaInstance } from "./java";
import { v4 as uuidv4 } from 'uuid';
import { processStatement } from "./statement";
import { logger } from "../actions/statement/execute/execute";

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

      logger().log('debug', `Retrieved worker ${worker.uuid } from free pool`);
      const processPromise = worker.handleTask(statement);

      processPromise.then(() => {
        logger().log('debug', `Returning worker ${worker.uuid} to free pool`);
        workerPool.push(worker);
      })

      return processPromise;
    },
    busyWorkerCount: () => workerCount - workerPool.length,
    destroyWorkerPool: () => {
      while (workerPool.length > 0) {
        const worker = workerPool.pop();
        worker.connectionObject.close();
        logger().log('debug', "Laid off all workers");
      }
    }
  }
}

const reserveConnection = (connectionOptions) => {
  const java = getJavaInstance();
  const connectionProperties = java.newInstanceSync('java.util.Properties');
  if (connectionOptions.user) {
    connectionProperties.put('user', connectionOptions.user);
  }

  if (connectionOptions.password) {
    connectionProperties.put('password', connectionOptions.password);
  }

  const connectionObject = java.callStaticMethodSync('java.sql.DriverManager', 'getConnection', connectionOptions.jdbcUrl, connectionProperties);

  return connectionObject;
}