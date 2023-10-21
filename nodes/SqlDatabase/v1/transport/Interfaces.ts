export interface ConnectionPool {
  reservePoolConnection: any,
  releasePoolConnection: any,
  getConnectionPool: any,
  destroyConnectionPool: any,
}

export interface ConnectionObject {
  release: any,
  createStatement: any,
}


export interface ConnectionOptions {
  jdbcUrl: string,
  user?: string,
  password?: string,
  minimumPoolConnections: number | 1,
  maximumPoolConnections: number | 1
}


export interface JavaOptions {
  driverDirectory?: string[],
  jvmArguments?: string[]
}