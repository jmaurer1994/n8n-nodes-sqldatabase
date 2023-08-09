/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as actions from './actions';

export class SqlDatabaseV1 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			displayName: 'SQL Database',
			description: 'Connect to a database and execute queries',
			version: 1,
			defaults: {
				name: 'SQL Database',
			},
			inputs: ['main'],
			outputs: ['main'],
			credentials: [
				...actions.credentials
			],
			properties: [
				...actions.properties
			],
		};
	}

	async execute(this: IExecuteFunctions) {
		return actions.route.call(this);
	}
}



	