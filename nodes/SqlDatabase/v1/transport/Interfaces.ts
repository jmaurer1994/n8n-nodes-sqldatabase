export interface ConnectionPool {
  reservePoolConnection: any,
  releasePoolConnection: any,
  getConnectionPool: any,
  destroyConnectionPool: any,
  getConnectionCount: any,
}

export interface ConnectionObject {
  release: any,
  createStatement: any,
}

