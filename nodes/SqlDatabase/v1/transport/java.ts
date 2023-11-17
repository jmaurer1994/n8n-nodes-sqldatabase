import NodeJavaCore, { NodeAPI } from "java";
import { readdirSync, realpathSync } from 'node:fs';

import { logger } from "../actions";

NodeJavaCore.asyncOptions = {
  asyncSuffix: "Async",
  syncSuffix: ""
};

export const getJavaInstance = (): NodeAPI => {
  return NodeJavaCore;
}

export const initializeJvm = ({ driverDirectory, driverClass }) => {
  if (NodeJavaCore.isJvmCreated()) {

    return NodeJavaCore;
  }

  try {
    if (driverDirectory) {
        logger().debug(`Scanning ${driverDirectory} for JAR files`);
      const foundJarFiles = searchDirectoryForFileType(driverDirectory, '.jar');
      if (foundJarFiles.length > 0) {
        for (let pathIndex = 0; pathIndex < foundJarFiles.length; pathIndex++) {
          logger().debug(`Adding ${foundJarFiles[pathIndex]} to classpath`);
          NodeJavaCore.classpath.push(foundJarFiles[pathIndex]);
        }
      }
    }
  } catch (e) {
    const err: string[] = [];

    err.push("Unable to walk driver directory");

    if (e.cause = "PATH_NOT_FOUND") {
      err.push("Specified path not found");
    }

    logger().error(err.join(': '));

    throw Error(err.join(': '));
  }

  try {
    if (driverClass && driverClass !== '') {
      const driver = NodeJavaCore.newInstance(driverClass) as any;
      NodeJavaCore.callStaticMethod(driver, 'registerDriver');
    }
  } catch (e) {
    logger().error(`Could not register driver with JDBC DriverManager`);
  }

  return NodeJavaCore;
}

const searchDirectoryForFileType = (directory: string, fileExtension: string): string[] => {
  const matchedFiles: string[] = [];

  if (!realpathSync(directory)) {
    throw Error("Specified path does not exist", { cause: 'PATH_NOT_FOUND' });
  }

  const dir = readdirSync(directory, {
    withFileTypes: true,
  })


  for (const dirEnt of dir) {
    logger().debug(`dirent: ${dirEnt} ${dirEnt.name}`)
    if (dirEnt.name?.endsWith(fileExtension)) {
      const path = `${dirEnt.path}/${dirEnt.name}`
      logger().debug(`pushing ${path} onto classpath`);
      matchedFiles.push(path);
    } else {
      matchedFiles.push(...searchDirectoryForFileType(`${directory}/${dirEnt.name}`, '.jar'));
    }
  }

  return matchedFiles
}