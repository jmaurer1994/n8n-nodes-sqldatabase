import { logger } from ".";

export const SqlDatabaseExecutionParameters = {} as any;
const parameters = {
  'user': { type: 'string', _default: null },
  'password': { type: 'string', _default: null },
  'jdbcUrl': { type: 'string', _default: null },
  'driverDirectory': { type: 'string', _default: './' },
  'driverClass': { type: 'string', _default: null },
  'maxConcurrentConnections': { type: 'number', _default: 1 }
};

export const setExecutionParameters = (credentials, continueOnFail) => {
  SqlDatabaseExecutionParameters.continueOnFail = continueOnFail;

  for (const parameter of Object.keys(parameters)) {
    const input = credentials[parameter];
    const { type, _default } = parameters[parameter]
    const { input: parameterValue, isValid: parameterIsValid } = validateOrParseInput(input, type);
    
    logger().log('debug', `[${parameter}] Validation Results: ${parameterValue} isValid: ${parameterIsValid}`);

    if (parameterIsValid) {
      SqlDatabaseExecutionParameters[parameter] = parameterValue;
    } else {
      logger().log('error', `SqlDatabaseExecutionParameters[${parameter}]: failed input validation`);

      if (!continueOnFail) {
        throw new Error("A parameter failed validation", { cause: parameter });
      }

      SqlDatabaseExecutionParameters[parameter] = _default;
    }
  }
}


const validateOrParseInput = (input, type): { input: any, isValid: boolean } => {
  switch (type) {
    case 'string':
      return validateOrParseStringInput(input);
    case 'number':
      return validateOrParseNumberInput(input);
  }
  return { input: null, isValid: false };
}

const validateOrParseNumberInput = (input): { input: number, isValid: boolean } => {
  const _input = parseInt(input);
  return { input: _input, isValid: !isNaN(_input) };
}

const validateOrParseStringInput = (input): { input: string, isValid: boolean } => {
  const isStringType = typeof input === 'string' || input instanceof String;
  switch (true) {
    case isStringType:
      return { input, isValid: input.length > 0 };
    case !isStringType && typeof input.toString === 'function':
      return validateOrParseStringInput(input.toString());
  }

  return { input: '', isValid: false };
}