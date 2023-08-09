import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

import * as jdbc from './jdbc'
import { IJdbcOptions } from './Interfaces';

export async function createPoolRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions
) {

	const {username, password, connectionUrl, driverClass, driverDependencies} = await this.getCredentials('sqlDatabase') as any;

	const classPath = Array.isArray(driverDependencies) ? driverDependencies : JSON.parse(driverDependencies)
 
	const jdbcConfig: IJdbcOptions = {
		url: connectionUrl,
		drivername: driverClass ? driverClass : '',
		minpoolsize: 10,
		maxpoolsize: 100,
		user: username,
		password: password,
		properties: {}
	}

	const jvmOptions: string[] = ['-Xrs']
	const jvmClassPath: string[] = classPath

	return jdbc.database.configure(jvmOptions, jvmClassPath, jdbcConfig)
}

export async function executeStatementRequest(
	pool,
	query
) {
	let rows = []

	try{
		const resultSet = await jdbc.statement.executeQuery(pool, query) as any;
	
		const parsedResultSet = await jdbc.resultset.parse(resultSet) as any;
	
		rows = parsedResultSet.rows
	} catch (e) {
		console.log(e)
		throw e
	}
	return rows
}