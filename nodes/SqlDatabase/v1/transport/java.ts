import NodeJavaCore, { NodeAPI } from "java";
import { readdirSync, realpathSync } from 'node:fs';

import { logger } from "../actions/statement/execute/execute";

NodeJavaCore.asyncOptions = {
  asyncSuffix: "Async",
  syncSuffix: ""
};

export const getJavaInstance = (): NodeAPI => {
  return NodeJavaCore;
}

export const initializeJvm = (javaOptions) => {
  const { driverDirectory } = javaOptions;

  if (NodeJavaCore.isJvmCreated()) {
    return NodeJavaCore;
  }

  try {
    if (driverDirectory) {
      const foundJarFiles = searchDirectoryForFileType(driverDirectory, '.jar');
      if (foundJarFiles.length > 0) {
        for (let pathIndex = 0; pathIndex < foundJarFiles.length; pathIndex++) {
          NodeJavaCore.classpath.push(foundJarFiles[pathIndex]);
        }
      }
    }
  } catch (e) {
    const err: string[] = [];

    err.push("Unable to walk driver directory");

    if(e.cause = "PATH_NOT_FOUND"){
      err.push("Specified path not found");
    }

    logger().log('error',err.join(': '));

    throw Error(err.join(': '));
  }

  return NodeJavaCore;
}

const searchDirectoryForFileType = (directory: string, fileExtension: string): string[] => {
  const matchedFiles: string[] = [];

  if (!realpathSync(directory)) {
    throw Error("Specified path does not exist", { cause: 'PATH_NOT_FOUND'});
  }

  const dir = readdirSync(directory, {
    withFileTypes: true,
    recursive: true
  })


  for(const dirEnt of dir){
    if(dirEnt?.name?.endsWith(fileExtension)){
      matchedFiles.push(`${dirEnt.path}/${dirEnt.name}`);
    }
  }

  return matchedFiles
}