import { getJavaInstance } from "./java";
import { StatementObject } from "./statement";

export type ConnectionObject = {
  createStatement: () => StatementObject
}

export const reserveConnection = ( user, password, jdbcUrl ) => {
  const java = getJavaInstance();
  const connectionProperties = java.newInstanceSync('java.util.Properties');

  const [urlPart, ...parameters] = jdbcUrl.split(';', 50);

  if(parameters && parameters.length > 0){
    for(const parameterString of parameters){
      const [parameterKey, parameterValue] = parameterString.split('=', 2);

      const parameterKeyIsNotValid = (!parameterKey || parameterKey === '');
      const parameterValueIsNotValid = (!parameterValue);

      if (parameterKeyIsNotValid || parameterValueIsNotValid){
        const parameterInvalidError = new Error(`reserveConnection(): Could not parse parameter string: ${parameterString}`);

        switch(true){
          case parameterKeyIsNotValid && parameterValueIsNotValid:
            parameterInvalidError.cause = 'Invalid parameter string supplied';
            break;
          case parameterKeyIsNotValid:
            parameterInvalidError.cause = 'Invalid parameter key';
            break;
          case parameterValueIsNotValid:
            parameterInvalidError.cause = 'Invalid parameter value';
            break;
        }


        throw parameterInvalidError;
      }
      connectionProperties.put(parameterKey, parameterValue);
    }
  }
  if (user) {
    connectionProperties.put('user', user);
  }

  if (password) {
    connectionProperties.put('password', password);
  }

  const connectionObject = java.callStaticMethodSync('java.sql.DriverManager', 'getConnection', urlPart, connectionProperties);

  return connectionObject;
}