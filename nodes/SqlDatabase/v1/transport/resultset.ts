import { logger } from "../actions";
import { getColumnTypeByValue } from "./sqltypes";

export type ResultSetObject = {
  next: () => boolean,
  getMetaData: () => ResultSetMetaDataObject
}

export type ResultSetMetaDataObject = {
  getColumnCount: () => number,
  getColumnName: (columnIndex: number) => string,
  getColumnLabel: (columnIndex: number) => string,
  getColumnType: (columnIndex: number) => string,
}

export const getResultSetMetadata = (resultSetObject: ResultSetObject): ResultSetMetaDataObject | null => {
  try{
    return resultSetObject.getMetaData();
  } catch (e) {
    console.log(e);
    return null;
  }
}

const getColumnData = (resultSetMetaDataObject: ResultSetMetaDataObject) => {
  //build columns
  const columnCount = resultSetMetaDataObject.getColumnCount();
  const columns: any[] = [];

  for (let i = 1; i <= columnCount; i++) {
    columns.push({
      name: resultSetMetaDataObject.getColumnName(i),
      index: i,
      label: resultSetMetaDataObject.getColumnLabel(i),
      type: {
        id: resultSetMetaDataObject.getColumnType(i),
        name: getColumnTypeByValue(resultSetMetaDataObject.getColumnType(i))
      },
    });
  }
  return columns
}

export const processResultSet = (resultSetMetaDataObject: ResultSetMetaDataObject, resultSetObject: ResultSetObject) => {
  try {
    const columns = getColumnData(resultSetMetaDataObject);
    const data: any[] = [];
    while (resultSetObject.next()) {
      const row: any[] = [];
      for (let i = 0, n = columns.length; i < n; i++) {
        const data = resultSetObject['get' + columns[i].type.name](columns[i].index);
        if (data === null) {
          row.push(null);
        } else {
          row.push(data.toString());
        }
      }

      data.push(row);
    }
    logger().debug(`Returning data`);

    return { columns, data };
  } catch (e) {
    logger().error(`Error while processing resultset\n\t${e}`);
    throw e
  }
}

