import { ICredentialType, INodeProperties } from 'n8n-workflow';

// eslint-disable-next-line n8n-nodes-base/cred-class-name-unsuffixed
export class SqlDatabase implements ICredentialType {
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-name-unsuffixed
	name = 'sqlDatabase';
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-display-name-missing-api
	displayName = 'SQL Database';
	properties: INodeProperties[] = [
		{
			displayName: 'User',
			name: 'user',
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
			displayName: 'JDBC Connection URL',
			name: 'jdbcUrl',
      type: 'string',
      required: true,
			hint: 'Consult your database\'s JDBC driver documentation',
			default: '',
		},
		{
			displayName: 'Driver Class',
			name: 'driverClass',
			type: 'string',
      hint: 'Consult your database\'s JDBC driver documentation',
      default: '',
		},
		{
			displayName: 'Driver directory',
			name: 'driverDirectory',
			type: 'string',
			hint: 'Directory containing JDBC driver JAR files to add onto the JVM classpath',
			default: '',
    },
    {
      displayName: 'Maxiumum Concurrent Connections',
      name: 'maxConcurrentConnections',
      type: 'number',
      hint: 'Limit number of connections',
      default: 1,
    },
	];
}
