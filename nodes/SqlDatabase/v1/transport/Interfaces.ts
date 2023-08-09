export type IJdbcOptions = {
  //required
  url: string,
  drivername?: string,
  //optional
  minpoolsize?: number,
  maxpoolsize?: number,

  user?: string,
  password?: string,
  properties?: {
  }
}


export type IJvmOptions = {

}

export type IJvmClasspath = string[]