const typeMap: string[] = [];

// Define the mapping for each constant field
typeMap[2003] = 'Array';     // ARRAY
typeMap[-5] = 'BigInt';      // BIGINT
typeMap[-2] = 'BinaryStream';// BINARY
typeMap[-7] = 'Boolean';     // BIT
typeMap[2004] = 'Blob';      // BLOB
typeMap[16] = 'Boolean';     // BOOLEAN
typeMap[1] = 'String';       // CHAR
typeMap[2005] = 'Clob';      // CLOB
typeMap[70] = 'URL';         // DATALINK
typeMap[91] = 'Date';        // DATE
typeMap[3] = 'BigDecimal';   // DECIMAL
typeMap[2001] = 'Object';    // DISTINCT
typeMap[8] = 'Double';       // DOUBLE
typeMap[6] = 'Float';        // FLOAT
typeMap[4] = 'Int';          // INTEGER
typeMap[2000] = 'Object';    // JAVA_OBJECT
typeMap[-16] = 'NString';    // LONGNVARCHAR
typeMap[-4] = 'BinaryStream';// LONGVARBINARY
typeMap[-1] = 'String';      // LONGVARCHAR
typeMap[-15] = 'NString';    // NCHAR
typeMap[2011] = 'NClob';     // NCLOB
typeMap[0] = 'Object';       // NULL
typeMap[2] = 'BigDecimal';   // NUMERIC
typeMap[-9] = 'NString';     // NVARCHAR
typeMap[1111] = 'Object';    // OTHER
typeMap[7] = 'Float';        // REAL
typeMap[2006] = 'Ref';       // REF
typeMap[-8] = 'RowId';       // ROWID
typeMap[5] = 'Short';        // SMALLINT
typeMap[2009] = 'SQLXML';    // SQLXML
typeMap[2002] = 'Object';    // STRUCT
typeMap[92] = 'Time';        // TIME
typeMap[93] = 'Timestamp';   // TIMESTAMP
typeMap[-6] = 'Byte';        // TINYINT
typeMap[-3] = 'BinaryStream';// VARBINARY
typeMap[12] = 'String';      // VARCHAR

export const getColumnTypeByValue = (typeValue) => typeMap[typeValue]