'use strict';

const mysql = require('promise-mysql');
// [START cloud_sql_mysql_mysql_create_socket]
const createUnixSocketPool = async (config) => {
  const dbSocketPath = process.env.DB_SOCKET_PATH || "/cloudsql"

  // Establish a connection to the database
  return await mysql.createPool({
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_NAME, // e.g. 'my-database'
    // If connecting via unix domain socket, specify the path
    socketPath: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    // Specify additional properties here.
    ...config
  });
}

// [END cloud_sql_mysql_mysql_create_socket]



const createPool = async () => {
  const config = {
    connectionLimit: 5,
    connectTimeout: 10000, // 10 seconds
    acquireTimeout: 10000, // 10 seconds
    waitForConnections: true, // Default: true
    queueLimit: 0, // Default: 0
  }
  return await createUnixSocketPool(config);
    
};
// [END cloud_sql_mysql_mysql_create]


// let pool;
const poolPromise = createPool()
  .then(async (pool) => {
    return pool;
  })
  .catch((err) => {
    console.log(err);
    process.exit(1)
  });

// exports.pool = pool;
exports.poolPromise = poolPromise;

  