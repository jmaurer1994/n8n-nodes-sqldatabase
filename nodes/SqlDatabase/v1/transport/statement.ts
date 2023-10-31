import { processResultSet } from "./resultset";
import { logger } from "../actions";

export const createStatementQueue = (getStatement) => {
  const retryQueue: any[] = []

  let itemIndex = 0;

  const dequeueStatement = () => {
    if (retryQueue.length > 0) {
      const statement = retryQueue.pop();
      logger().log('debug', `Retrying failed query: ${statement.split('\n').join('\n\t')}`);
      return retryQueue.pop();
    }

    const statement = {
      sql: getStatement(itemIndex),
      itemIndex
    }

    itemIndex++;
    return statement;
  }

  const requeueStatement = (statement) => {
    retryQueue.push(statement);
  }

  return {
    dequeueStatement,
    requeueStatement
  }
}

export const processStatement = (statement, connectionObject) => {
  return new Promise((resolve, reject) => {
    const { sql, itemIndex } = statement;
    logger().log('debug', `Processing statement at item index ${itemIndex}\n\tsql:\n\t\t${sql.split('\n').join('\t\t\n')}\n`)
    try {
      const statementObject = connectionObject.createStatement();

      statementObject.executeQueryAsync(sql, async (err, resultSetObject) => {
        if (err) {
          try {
            if (!statementObject.isClosed()) {
              statementObject.close();
            }
          } catch (e) {
            //attempt cleanup, but the statement is probably closed at this point anyway
            logger().log('debug', `Attempted to close statement, but encountered an error\n\titem: ${statement.statementIndex}`);
          }
          reject(err); return;
        }

        logger().log('debug', `Executed query, processing resultset`);

        const { columns, data } = await processResultSet(resultSetObject);
        //Todo check if they need to be closed first
        try {
          if (!resultSetObject.isClosed()) {
            resultSetObject.close();
          }
        } catch (e) {
          //attempt cleanup, but the statement is probably closed at this point anyway
          logger().log('debug', `Attempted to close resultset, but encountered an error\n\titem: ${statement.statementIndex}`);
        }

        try {
          if (!statementObject.isClosed()) {
            statementObject.close();
          }
        } catch (e) {
          //attempt cleanup, but the statement is probably closed at this point anyway
          logger().log('debug', `Attempted to close statement, but encountered an error\n\titem: ${statement.statementIndex}`);
        }

        resolve({ columns, data, itemIndex}); return;
      });
    } catch (e) {
      logger().log('error', `Error while processing statement at item index ${statement.itemIndex}`);
      reject(e); return;
    }
  })
}