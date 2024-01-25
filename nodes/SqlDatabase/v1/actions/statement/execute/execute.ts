import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { executeStatementBatch } from '../../../transport';

export const SqlDatabaseNodeOptions = {} as any;

export async function execute(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const { user, password, jdbcUrl, driverDirectory, driverClass, maxConcurrentConnections } = await this.getCredentials('sqlDatabase') as any;

  SqlDatabaseNodeOptions.continueOnFail = this.continueOnFail();

  const javaOptions = {
    driverDirectory,
    driverClass
  }

  const connectionOptions = {
    user,
    password,
    jdbcUrl
  } as any;

  if(driverClass && driverClass !== ''){
    connectionOptions.driverClass = driverClass
  }

  if (typeof maxConcurrentConnections !== 'number'){
    const _maxConcurrentConnections = parseInt(maxConcurrentConnections);
    if(!isNaN(_maxConcurrentConnections)){
      //is a number
      connectionOptions.maxConcurrentConnections = _maxConcurrentConnections;
    } else {
      if(!SqlDatabaseNodeOptions.continueOnFail){
        throw new Error("Invalid parameter supplied: maxConcurrentConnections");
      }

      connectionOptions.maxConcurrentConnections = 1;
    }
  } else {
    connectionOptions.maxConcurrentConnections = maxConcurrentConnections;
  }
  
  //Wrap the getNodeParameter call to avoid passing the calling context around
  const numberOfStatements = this.getInputData().length;

  const statementQueue: string[] = [];
  for (let i = 0; i < numberOfStatements; i++) {
    statementQueue.push(this.getNodeParameter('sqlStatement', i) as string);
  }

  const batchResults = await executeStatementBatch(statementQueue, javaOptions, connectionOptions);

  return batchResults
}