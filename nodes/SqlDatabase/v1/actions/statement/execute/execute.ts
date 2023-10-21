import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { jdbc } from '../../../transport';
import { ConnectionPool } from '../../../transport/Interfaces';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function execute(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const results = []
  const { user, password, jdbcUrl, driverDirectory } = await this.getCredentials('sqlDatabase') as any
  //create pool
  const { java, pool, statement, resultset } = jdbc;

  java.initializeJvm({
    driverDirectory
  })

  const poolOptions = {
    minimumPoolConnections: 1,
    maximumPoolConnections: 1,
    jdbcUrl,
    user,
    password
  }

  const { getConnectionPool } = pool.createConnectionPool(poolOptions)
  const connectionPool = getConnectionPool();

  const items = this.getInputData();

  let connectionCounter = connectionPool.length;
  let itemIndex = 0;

  while(itemIndex > 0){
    const sql = this.getNodeParameter('sqlStatement', itemIndex);

    if(connectionCounter > 0){
      connectionCounter--;
      const connectionObject = connectionPool.pop();
      const resultSet = statement.executeStatement(connectionObject, sql);

      while(resultSet.next()){
        console.log("test")
      }

      resultSet.close();

      connectionPool.push(connectionObject);
      connectionCounter++;
    } else {
      console.log("Awaiting free connection to continue processing")
      await sleep(100);
    }
  }
  //return
  

  return results
}