import { ICredentialType, INodeProperties } from 'n8n-workflow';

// eslint-disable-next-line n8n-nodes-base/cred-class-name-unsuffixed
export class SqlDatabase implements ICredentialType {
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-name-unsuffixed
	name = 'sqlDatabase';
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-display-name-missing-api
	displayName = 'SQL Database';
	properties: INodeProperties[] = [
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			required: true,
			typeOptions: {
				password: true
			},
			default: '',
		},
		{
			displayName: 'Connection URL',
			name: 'connectionUrl',
			type: 'string',
			hint: 'JDBC Connection URL',
			default: '',
		},
		{
			displayName: 'Driver Class',
			name: 'driverClass',
			type: 'string',
			hint: 'JDBC Driver Class',
			default: '',
		},
		{
			displayName: 'Driver Dependencies',
			name: 'driverDependencies',
			type: 'json',
			hint: 'JDBC Driver Dependencies',
			default: [],
		},
	];
}
