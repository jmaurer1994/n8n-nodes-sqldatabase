import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { createPoolRequest, executeStatementRequest } from '../../../transport';

export async function execute(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {

	let queries: any[] = []
	const items = this.getInputData()

	this.logger.debug("Parsing input queries")

	for(let i = 0, n = items.length; i < n; ++i){
		let query = this.getNodeParameter('sqlStatement', i) as string
		const { parameters } = this.getNodeParameter('sqlParameters', i) as any
		if(parameters?.length > 0){
			const regex = /%[a-zA-Z0-9]{1,12}%/;
			const tokens = query.match(regex) as any[]
			if(tokens){
				for(let i = 0, n = tokens.length; i < n; ++i){
					const matchedParams = parameters.filter(parameter => parameter.key === tokens[i].substring(1, tokens[i].length - 1))
					if(matchedParams.length > 0){
						const {value} = matchedParams[0]
						query = query.replaceAll(tokens[i], value)
					}
				}
			}
		}

		queries.push(query)
	}

	try{
		const pool = await createPoolRequest.call(this)
		console.log("Established connection to server")
		
		console.log(`Executing ${ queries.length } queries`)
		this.logger.log('debug',`Executing ${ queries.length } queries`)

		const rawResults :any[] = []

		for(let i = 0, n = queries.length; i < n; ++i){
			try{
				const result = await executeStatementRequest.call(this, pool, queries[i])
				
				console.log(`[${i}]: ${result.length} results`)
				rawResults.push(result)
			} catch (e){
				if (this.continueOnFail()) {
					rawResults.push({ json: this.getInputData(i)[0].json, error: e });
				} else {
					console.log(e)
					if (e.context) e.context.itemIndex = i;
					throw e;
				}
			}
		}

		console.log("Returning Results")
		let results :any[] = []

		const { groupOutput } = this.getNodeParameter('additionalOptions', 0) as any

		if(groupOutput){
			const groupedResults :any[] = []

			for(let i = 0, n = rawResults.length; i < n; ++i){
				if(rawResults[i]?.length){
					groupedResults.push(...rawResults[i])
				}
			}

			results = this.helpers.returnJsonArray(groupedResults)
		} else {
			for(let i = 0, n = items.length; i < n; ++i){
				console.log(rawResults[i])

				results.push({
					"json": { results: rawResults[i]},
					"pairedItem": {
						"item": items[i].pairedItem
					}
				})
			}
		}

		return results
	} catch (e) {
		console.log("execute() outside: ",e)
		throw e
	 }
}