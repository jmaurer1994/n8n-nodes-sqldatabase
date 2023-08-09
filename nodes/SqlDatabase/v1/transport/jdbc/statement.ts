import { reserve, release } from './pool'
/*
export const prepare = (db, sql, callback) => {
  reserve(db, function(err, connobj, conn) {
    conn.prepareStatement(sql, function(err, preparedstatement) {
      release(db, connobj, err, preparedstatement, callback);
    });
  });
};

export const prepareCall = (db, sql, callback) => {
  reserve(db, function(err, connobj, conn) {
    conn.prepareCall(sql, function(err, callablestatement) {
      release(db, connobj, err, callablestatement, callback);
    });
  });
};

export const query = (db, sql, callback) => {
  reserve(db, function(err, connobj, conn) {
    console.log("Reserved Connection")

    conn.createStatement(function(err, statement) {
      console.log("Created statement", err)
      if (err) {
        release(db, connobj, err, null, callback);
      } else {
        console.log("Statement", statement, sql)
        statement.executeQuery(sql, function(err, result) {
          console.log("err query", err)
          console.log("executed query", result)
          release(db, connobj, err, result, callback);
        });
      }
    });
  });
};
*/

export const executeQuery = (db, sql) => {
  return new Promise(async (resolve, reject) => {
    try{
      const {err, connobj, conn} = await reserve(db) as any;

      if(err){
        reject(err)
        return;
      }
  
      conn.createStatement(function(err, statement){
        if(err){
          reject(err)
          return;
        } 
        statement.executeQuery(sql, async function(err, resultSet){
          await release(db,connobj)
          if(err){
            reject(err)
          } else {
            resolve(resultSet)
  
          }
        })
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  })
}