import * as execute from './execute';

import type { INodeProperties } from 'n8n-workflow';

export { execute };

export const properties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['statement'],
			},
		},
		options: [
			{
				name: 'Execute Statement',
				value: 'execute',
				description: 'Execute input statement(s)',
				action: 'Execute a SQL statement',
			}
		],
		default: 'execute',
	},
	...execute.properties,
];