import NodeJavaCore, { NodeAPI } from "java";
import { JavaOptions } from "../Interfaces";
NodeJavaCore.asyncOptions = {
  syncSuffix: ""
};

export const getJavaInstance = (): NodeAPI => {
  if (NodeJavaCore.isJvmCreated()) {
    console.log("JVM already created, can't add to class path");
    return NodeJavaCore;
  }
  
  return initializeJvm();
}

export const initializeJvm = (options?: JavaOptions) => {
  console.log("Initializing JVM...");

  if (options?.driverDirectory) {
    const validationResults = attemptClasspathInputValidation(options.driverDirectory);

    for (let r = 0; r < validationResults.length; r++) {
      const result = validationResults[r];
      NodeJavaCore.classpath.push(result);
    }
  }
  return NodeJavaCore;
}

const attemptClasspathInputValidation = (classpathArr) => {
  return classpathArr
}
