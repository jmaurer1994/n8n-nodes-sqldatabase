import type { INodeProperties } from 'n8n-workflow';

export { route } from './route';
export { credentials } from './credentials'

import * as statement from './statement';

export { statement };

export const properties: INodeProperties[] = [
    {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
            {
                name: 'Statement',
                value: 'statement',
            },
        ],
        default: 'statement',
    },
	...statement.properties,
];