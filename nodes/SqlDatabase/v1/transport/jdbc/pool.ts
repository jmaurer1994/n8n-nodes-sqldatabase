
export const reserve = (db) => {
  return new Promise((resolve, reject) => {
    db.reserve(function(err, connobj) {
      if (err) {
        reject({err});
      } else {
        resolve({err, connobj, conn: connobj.conn});
      }
    })
  })
}

export const release = async (db, connobj) => {
  return new Promise((resolve, reject) => {
    db.release(connobj, function(result) {
      if (result === null) {
        resolve({result: true});
      } else {
        reject({err: result, result: false});
      }
    })
  })
}