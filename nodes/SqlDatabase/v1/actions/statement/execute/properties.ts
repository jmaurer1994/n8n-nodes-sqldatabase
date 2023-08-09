import type { StatementProperties } from '../../Interfaces';

export const statementExecuteProperties: StatementProperties = [
	{
		displayName: 'Connection Type',
		name: 'connectionType',
		type: 'options',
		noDataExpression: true,
		required: true,
		displayOptions: {
			show: {
				resource: ['statement'],
				operation: ['execute'],
			},
		},
		options: [
			{
				name: 'JDBC Driver',
				value: 'jdbc',
				description: 'Connect using a specified JDBC driver',
			},
			{
				name: 'ODBC Data Source',
				value: 'odbc',
				description: 'Connect using an ODBC Data Source',
			},
		],
		default: 'jdbc',
	},
	{
		displayName: 'SQL Statement',
		name: 'sqlStatement',
		type: 'string',
		required: true,
		typeOptions: {
			rows: 12
		},
		displayOptions: {
			show: {
				resource: ['statement'],
				operation: ['execute'],
			},
		},
		default: '',
	},
	{
		displayName: 'Statement Parameters',
		name: 'sqlParameters',
		placeholder: 'Add Parameter',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		description: 'Add dynamic parameters to SQL statement',
		options: [
			{
				name: 'parameters',
				displayName: 'Parameters',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: 'Name of the metadata key to add.',
						description: 'Key used for replacement',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value to set for the parameter',
					},
				],
			},
		],
		displayOptions: { 
			show: {
				resource: ['statement'],
				operation: ['execute'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'statement',
				],
				operation: [
					'execute',
				],
			},
		},
		options: [
			{
				displayName: 'Group Output',
				name: 'groupOutput',
				type: 'boolean',
				default: false,
			},
		],
	},
	
];