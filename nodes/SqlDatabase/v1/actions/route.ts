import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import type { SqlDatabase } from './Interfaces';
import * as statement from './statement';
import { setExecutionParameters } from './parameters';

let _logger = null as any;

export const logger = () => _logger;

export async function route(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const operationResult: INodeExecutionData[] = [];

	let executionData: INodeExecutionData | INodeExecutionData[] = [];
  _logger = this.logger;

	const resource = this.getNodeParameter<SqlDatabase>('resource', 0);
	let operation = this.getNodeParameter('operation', 0);

  setExecutionParameters(
    await this.getCredentials('sqlDatabase'),
    this.continueOnFail());

	const sqlDatabase = {
		resource,
		operation,
	} as SqlDatabase;

	
	try {
		if (sqlDatabase.resource === 'statement') {
			executionData = await statement[sqlDatabase.operation].execute.call(this);
		} 

		operationResult.push(...executionData);
	} catch (err) {
			throw err;
	}

	return [operationResult];
}