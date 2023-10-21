import { ConnectionObject, ConnectionOptions, ConnectionPool } from "../Interfaces";
import { getJavaInstance } from "./java";
import { v4 as uuidv4 } from 'uuid';

export const createConnectionPool = (options: ConnectionOptions): ConnectionPool => {
  const pool: ConnectionObject[] = [];

  const reservePoolConnection = (): {} | false => {
    if (pool.length >= options.maximumPoolConnections) {
      return false;
    }

    const connectionObject = reserve(options);
    pool.push(connectionObject)

    return connectionObject
  }

  const releasePoolConnection = (uuid): boolean => {
    if (pool.length <= options.minimumPoolConnections) {
      return false;
    }

    release(pool[uuid])

    return true
  }

  const destroyConnectionPool = (): boolean => {
    const connectionUuids = Object.keys(pool);

    for (let i = 0; i < connectionUuids.length; i++) {
      const uuid = connectionUuids[i];
      release(pool[uuid]);
    }

    return true
  }

  for (let p = 0; p < options.minimumPoolConnections; p++) {
    reservePoolConnection()
  }

  return {
    reservePoolConnection,
    releasePoolConnection,
    destroyConnectionPool,
    getConnectionPool: () => [...pool]
  }
}

export const reserve = (options: ConnectionOptions): ConnectionObject => {
  const java = getJavaInstance();
  const connectionProperties = java.newInstanceSync('java.util.Properties');
  if (options.user) {
    connectionProperties.put('user', options.user);
  }

  if (options.password) {
    connectionProperties.put('password', options.password);
  }

  const connectionObject = java.callStaticMethodSync('java.sql.DriverManager', 'getConnection', options.jdbcUrl, connectionProperties);
  connectionObject.uuid = uuidv4();
  
  return connectionObject;
}

export const release = (connectionObject) => {
  return connectionObject.release();
}