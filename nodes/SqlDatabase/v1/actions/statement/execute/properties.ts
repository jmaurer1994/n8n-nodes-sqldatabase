import type { StatementProperties } from '../../Interfaces';

export const statementExecuteProperties: StatementProperties = [
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
      {
        displayName: 'Output Results to Binary',
        name: 'outputBinaryResults',
        type: 'boolean',
        default: false,
      },
		],
	},
	
];