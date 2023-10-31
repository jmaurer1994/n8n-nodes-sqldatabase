import { SqlDatabaseExecutionParameters } from "../actions/parameters";
import { getJavaInstance } from "./java";

export const reserveConnection = () => {
  const java = getJavaInstance();
  const connectionProperties = java.newInstanceSync('java.util.Properties');
  const { user, password, jdbcUrl } = SqlDatabaseExecutionParameters;

  if (user) {
    connectionProperties.put('user', user);
  }

  if (password) {
    connectionProperties.put('password', password);
  }

  const connectionObject = java.callStaticMethodSync('java.sql.DriverManager', 'getConnection', jdbcUrl, connectionProperties);

  return connectionObject;
}