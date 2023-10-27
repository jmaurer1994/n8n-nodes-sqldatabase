import { getJavaInstance } from "./java";

export const reserveConnection = ({user, password, jdbcUrl}) => {
  const java = getJavaInstance();
  const connectionProperties = java.newInstanceSync('java.util.Properties');
  if (user) {
    connectionProperties.put('user', user);
  }

  if (password) {
    connectionProperties.put('password', password);
  }

  const connectionObject = java.callStaticMethodSync('java.sql.DriverManager', 'getConnection', jdbcUrl, connectionProperties);

  return connectionObject;
}