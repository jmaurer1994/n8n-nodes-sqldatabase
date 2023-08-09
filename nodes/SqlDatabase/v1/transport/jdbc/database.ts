const jdbc = require('jdbc');
const jinst = require('jdbc/lib/jinst');

export const configure = async (
  jvmOptions: string[] = [],
  jvmClassPath: string[] = [],
  jdbcOptions: {},
) => {
  if (!jinst.isJvmCreated()) {
      jvmOptions.map(jvmOption => 
        jinst.addOption(jvmOption))
      jinst.setupClasspath(jvmClassPath);
    }
  const db = new jdbc(jdbcOptions);

  db?.initialize(function(err) {
    if (err) {
      console.log(err);
    }
  });

  return db;
};

/*

export const tableexists = (db, catalog, schema, name, callback) => {
  reserve(db, function(err, connobj, conn) {
    conn.getMetaData(function(err, metadata) {
      if (err) {
        release(db, connobj, err, null, callback);
      } else {
        metadata.getTables(catalog, schema, name, null, function(err, resultset) {
          if (err) {
            release(db, connobj, err, null, callback);
          } else {
            resultset.toObjArray(function(err, results) {
              release(db, connobj, err, results.length > 0, callback);
            });
          }
        });
      }
    });
  });
};

export const metadata = (db, callback) => {
  reserve(db, function(err, connobj, conn) {
    conn.getMetaData(function(err, metadata) {
      release(db, connobj, err, metadata, callback);
    });
  });
};
*/