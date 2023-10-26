import { logger } from "../actions/statement/execute/execute";
import { getColumnTypeByValue } from "./sqltypes";

export const processResultSet = (resultSetObject, callback) => {
  try {
    const resultSetMetaDataObject = resultSetObject.getMetaData();

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
    callback(null, { columns, data });
  } catch (e) {
    logger().log('error', `Error while processing resultset\n\t${e}`);
    callback(e, null);
  }
}

