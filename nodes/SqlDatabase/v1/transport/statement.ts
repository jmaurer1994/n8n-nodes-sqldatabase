import { processResultSet } from "./resultset";

export const createStatementQueue = (getStatement) => {
  const retryQueue: any[] = []

  let statementIndex = 0;

  const dequeueStatement = () => {
    if (retryQueue.length > 0) {
      const statement = retryQueue.pop();
      console.log(`Retrying failed query: ${ statement.split('\n').join('\n\t') }`);
      return retryQueue.pop();
    }

    const statement = getStatement(statementIndex);
    statementIndex++;
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

    statementObject.executeQueryAsync(statement, (err, resultSetObject) => {
      if (err) {
        statementObject.close();
        reject(err);
      }
      processResultSet(resultSetObject, (err, result) => {
        //Todo check if they need to be closed first
        resultSetObject.close();
        statementObject.close();

        if (err) {
          reject(err); return;
        }
        
        resolve(result); return;
      })
    });
  })
}