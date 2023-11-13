import { logger } from "../actions";
import { getJavaInstance } from "./java";

export const reserveConnection = ({user, password, jdbcUrl}) => {
  const java = getJavaInstance();
  const connectionProperties = java.newInstanceSync('java.util.Properties');

  const [urlPart, ...parameters] = jdbcUrl.split(';', 50);
  console.log('===============================================================================================\n\n\n\n')
  console.log(urlPart)
  console.log(parameters)
  if(parameters){
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
      logger().d
      connectionProperties.put(parameterKey, parameterValue);
    }
  }
  if (user) {
    connectionProperties.put('user', user);
  }

  if (password) {
    connectionProperties.put('password', password);
  }

  const connectionObject = java.callStaticMethodSync('java.sql.DriverManager', 'getConnection', jdbcUrl, connectionProperties);

  return connectionObject;
}