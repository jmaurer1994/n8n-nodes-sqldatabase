import { ConnectionObject } from "./connection";
import { ResultSetObject } from "./resultset";

export type StatementObject = {
  executeQuery: (sql: string) => ResultSetObject
}

export const createStatement = (connectionObject: ConnectionObject): StatementObject | null => {
  try {
    const statementObject = connectionObject.createStatement();
    return statementObject;

  } catch (e) {
    console.log(e)
    return null
  }
}

export const executeStatement = (statement, statementObject: StatementObject): ResultSetObject | null => {
  try {
    const resultSetObject = statementObject.executeQuery(statement.sql);

    return resultSetObject
  } catch (e) {
    console.log(e)
    return null
  }
}