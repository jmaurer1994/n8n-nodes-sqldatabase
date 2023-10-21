export interface SqlDatabaseCredential{
  username: string,
  password: string,
  connectionUrl: string,
  driverClass?: string,
  driverDependencies?: any
}