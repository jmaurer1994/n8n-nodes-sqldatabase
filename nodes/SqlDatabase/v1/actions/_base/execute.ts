import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';


export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	//const username = this.getNodeParameter('username', index) as string;ody, qs);

	return this.helpers.returnJsonArray([] as IDataObject[]);
}