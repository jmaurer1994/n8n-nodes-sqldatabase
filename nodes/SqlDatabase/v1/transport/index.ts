import * as java from './java'

export type n8nJdbcConnector = {
  executeQueriesAsync: () => string[];
}

export const executeStatementBatch = async (statementQueue, javaOptions, {jdbcUrl, user, password}) => {
  const javaInstance = java.initializeJvm(javaOptions);
  const statementBatchResults = [];
  const n8nJdbcConnectorObject = javaInstance.newInstance('n8nJdbcConnector', [jdbcUrl, user, password, 5]) as any;

  const resultPromise = new Promise((resolve, reject) => {
    n8nJdbcConnectorObject.executeQueriesAsync(statementQueue, (err, result) => {

    });
  });
  
  await resultPromise

  console.log(resultPromise)

  return statementBatchResults;
}
