import { processResultSet } from "./resultset";

export const createStatementQueue = (getStatement) => {
  const retryQueue: any[] = []

  let itemIndex = 0;

  const dequeueStatement = () => {
    if (retryQueue.length > 0) {
      const statement = retryQueue.pop();
      console.log(`Retrying failed query: ${statement.split('\n').join('\n\t')}`);
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
    const statementObject = connectionObject.createStatement();
    const { sql, itemIndex } = statement;
    console.log(statement)
    try {
      statementObject.executeQueryAsync(sql, (err, resultSetObject) => {
        if (err) {
          try {
            if (!statementObject.isClosed()) {
              statementObject.close();
            }
          } catch (e) {
            //attempt cleanup, but the statement is probably closed at this point anyway
            console.log(`Attempted to close statement, but encountered an error\n\titem: ${statement.statementIndex}`);
          }
          reject(err);
        }
        processResultSet(resultSetObject, (err, result) => {
          //Todo check if they need to be closed first

          resultSetObject.close();
          statementObject.close();

          if (err) {
            reject(err); return;
          }

          result.itemIndex = itemIndex;
          resolve(result); return;
        })
      });
    } catch (e) {
      reject(e); return;
    }
  })
}