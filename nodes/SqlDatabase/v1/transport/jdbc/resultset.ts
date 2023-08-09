const jinst = require('jdbc/lib/jinst');
const java = jinst.getInstance();

export const parse = (resultSet) => {
  const rs = resultSet._rs;

  const rsmd = rs.getMetaDataSync()
  const columns = getColumns(rsmd)

  const rows: any[] = []
  while(rs.nextSync()){
    const row = {}

    for(let i = 0, n = columns.length; i < n; i++){
      const data = rs['get' + columns[i].type.name + 'Sync'](columns[i].index)

      switch(columns[i].type.name){
        case 'Date':
          row[columns[i].name] = data.toString()
          break;
        default:
          row[columns[i].name] = data
      }
    }
    
    rows.push(row)
  }

  return { columns, rows};
}

const getColumns = (rsmd) => {
  const count = rsmd.getColumnCountSync();

  const columns: any[] = []
  for(let i = 1; i <= count; ++i){
    columns.push({
      name: rsmd.getColumnNameSync(i),
      index: i,
      label: rsmd.getColumnLabelSync(i),
      type: {
        id: rsmd.getColumnTypeSync(i),
        name: typeToName(rsmd.getColumnTypeSync(i))
      },
    })
  }

  return columns
}

const typeToName = (intType) => { 
  const typeNames: string[] = [];

  typeNames[java.getStaticFieldValue("java.sql.Types", "BIT")] = "Boolean";
  typeNames[java.getStaticFieldValue("java.sql.Types", "TINYINT")] = "Short";
  typeNames[java.getStaticFieldValue("java.sql.Types", "SMALLINT")] = "Short";
  typeNames[java.getStaticFieldValue("java.sql.Types", "INTEGER")] = "Int";
  typeNames[java.getStaticFieldValue("java.sql.Types", "BIGINT")] = "String";
  typeNames[java.getStaticFieldValue("java.sql.Types", "FLOAT")] = "Float";
  typeNames[java.getStaticFieldValue("java.sql.Types", "REAL")] = "Float";
  typeNames[java.getStaticFieldValue("java.sql.Types", "DOUBLE")] = "Double";
  typeNames[java.getStaticFieldValue("java.sql.Types", "NUMERIC")] = "BigDecimal";
  typeNames[java.getStaticFieldValue("java.sql.Types", "DECIMAL")] = "BigDecimal";
  typeNames[java.getStaticFieldValue("java.sql.Types", "CHAR")] = "String";
  typeNames[java.getStaticFieldValue("java.sql.Types", "VARCHAR")] = "String";
  typeNames[java.getStaticFieldValue("java.sql.Types", "LONGVARCHAR")] = "String";
  typeNames[java.getStaticFieldValue("java.sql.Types", "DATE")] = "Date";
  typeNames[java.getStaticFieldValue("java.sql.Types", "TIME")] = "Time";
  typeNames[java.getStaticFieldValue("java.sql.Types", "TIMESTAMP")] = "Timestamp";
  typeNames[java.getStaticFieldValue("java.sql.Types", "BOOLEAN")] = "Boolean";
  typeNames[java.getStaticFieldValue("java.sql.Types", "NCHAR")] = "String";
  typeNames[java.getStaticFieldValue("java.sql.Types", "NVARCHAR")] = "String";
  typeNames[java.getStaticFieldValue("java.sql.Types", "LONGNVARCHAR")] = "String";
  typeNames[java.getStaticFieldValue("java.sql.Types", "BINARY")] = "Bytes";
  typeNames[java.getStaticFieldValue("java.sql.Types", "VARBINARY")] = "Bytes";
  typeNames[java.getStaticFieldValue("java.sql.Types", "LONGVARBINARY")] = "Bytes";
  typeNames[java.getStaticFieldValue("java.sql.Types", "BLOB")] = "Bytes";

  return typeNames[intType]
}