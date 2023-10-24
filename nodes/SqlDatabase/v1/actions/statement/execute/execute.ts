import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { executeStatementBatch } from '../../../transport';

export const SqlDatabaseNodeOptions = {} as any;

export async function execute(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const { user, password, jdbcUrl, driverDirectory, maxConcurrentConnections } = await this.getCredentials('sqlDatabase') as any;

  SqlDatabaseNodeOptions.continueOnFail = this.continueOnFail();

  const connectionOptions = {
    user,
    password,
    jdbcUrl
  } as any;

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


  const javaOptions = {
    driverDirectory
  }

  
  //Wrap the getNodeParameter call to avoid passing the calling context around
  const numberOfStatements = this.getInputData().length;
  const getStatement = (i) => {
    if(i < numberOfStatements){
      return this.getNodeParameter('sqlStatement', i);
    }
    return null
  }

  return await executeStatementBatch(javaOptions, connectionOptions, getStatement);
}