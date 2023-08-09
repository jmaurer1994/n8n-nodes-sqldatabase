import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { SqlDatabaseV1 } from './v1/SqlDatabaseV1.node';

export class SqlDatabase extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'SQL Database',
			name: 'sqlDatabase',
			group: ['output'],
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'Connect to a database and execute queries',
			defaultVersion: 1,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new SqlDatabaseV1(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}