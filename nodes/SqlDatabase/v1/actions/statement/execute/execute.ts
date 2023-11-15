import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { executeStatementBatch } from '../../../transport';
import { logger } from '../../route';

export const SqlDatabaseNodeOptions = {} as any;

export async function execute(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {

  const outputOptions = this.getNodeParameter('additionalOptions', 0) as any;
  
  //Wrap the getNodeParameter call to avoid passing the calling context around
  const numberOfStatements = this.getInputData().length;
  const getStatement = (i) => {
    if(i < numberOfStatements){
      return this.getNodeParameter('sqlStatement', i);
    }
    return null;
  }

  const batchResults = await executeStatementBatch(getStatement);

  return formatForOutput(batchResults, outputOptions);
}


//group results: when all queries return the same schema, union the output
//output to binary: send results straight to binary
//retain input data: 

const formatForOutput = (batchResults, { groupOutput }) => {
  const results: any[] = [];

  logger().debug(`Formatting result for output`);

  let referenceCols = null;

  for (let i = 0; i < batchResults.length; i++) {
    const { columns, data, itemIndex } = batchResults[i];
    const resultTarget = groupOutput ? results : [];

    if(groupOutput){
      const cols = columns.map(column => column.name).join('|')
      if(i === 0){
        referenceCols = columns.map(column => column.name).join('|');
      }

      if(cols !== referenceCols){
        throw new Error(`Unable to group output - column mismatch between query results\n\tExpected: ${referenceCols}\n\tGot: ${cols}`);
      }
    }
    for (let i = 0; i < data.length; i++) {
      const formattedRow = {}
      for (let j = 0; j < columns.length; j++) {
        formattedRow[columns[j].name] = data[i][j];
      }

      if (groupOutput) {
        resultTarget.push({ json: formattedRow, pairedItem: itemIndex });
      } else {
        resultTarget.push(formattedRow);
      }
    }

    if(!groupOutput){
      results.push({ json: { result: resultTarget}, pairedItem: itemIndex });
    }
  }

  return results;
}
