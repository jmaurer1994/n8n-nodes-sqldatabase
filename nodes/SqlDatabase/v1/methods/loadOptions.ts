
import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';


export async function getCredentialOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>{
	/**
	 * TODO: implement getOpenConnections()
	 */
	
	const returnData: INodePropertyOptions[] = [];

	if (returnData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No open database connections');
	}

	return [] as INodePropertyOptions[];
}

export async function getOpenConnections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>{
	/**
	 * TODO: implement getOpenConnections()
	 */
	
	const returnData: INodePropertyOptions[] = [];

	if (returnData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No open database connections');
	}

	return [] as INodePropertyOptions[];
}
