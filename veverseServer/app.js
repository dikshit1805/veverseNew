/**
 * Copyright 2019, Google LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START getting_started_auth_all]
const express = require('express');
//const metadata = require('gcp-metadata');
var cors = require('cors');
//const {OAuth2Client} = require('google-auth-library');

const mysql = require('promise-mysql');
const bodyParser = require('body-parser');


//require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});

const app = express();
app.use(cors());
//const oAuth2Client = new OAuth2Client();
app.set('view engine', 'pug');
app.enable('trust proxy');

// Automatically parse request body as form data.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Set Content-Type for all responses for these routes.
app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.set('Content-Type', 'application/json');
  next();
});


// Cache externally fetched information for future invocations
//let aud;

// [START getting_started_auth_metadata]
// async function audience() {
//   if (!aud && (await metadata.isAvailable())) {
//     let project_number = await metadata.project('numeric-project-id');
//     let project_id = await metadata.project('project-id');

//     aud = '/projects/' + project_number + '/apps/' + project_id;
//   }

//   return aud;
// }
// [END getting_started_auth_metadata]

// [START getting_started_auth_audience]
// async function validateAssertion(assertion) {
//   if (!assertion) {
//     return {};
//   }

  // Check that the assertion's audience matches ours
  //const aud = await audience();

  // Fetch the current certificates and verify the signature on the assertion
  // [START getting_started_auth_certs]
  // const response = await oAuth2Client.getIapPublicKeys();
  // // [END getting_started_auth_certs]
  // const ticket = await oAuth2Client.verifySignedJwtWithCertsAsync(
  //   assertion,
  //   response.pubkeys,
  //   aud,
  //   ['https://cloud.google.com/iap']
  // );
  // const payload = ticket.getPayload();

  // Return the two relevant pieces of information
//   return {
//     email: payload.email,
//     sub: payload.sub,
//   };
// }
// [END getting_started_auth_audience]


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
    // [START cloud_sql_mysql_mysql_limit]
    // 'connectionLimit' is the maximum number of connections the pool is allowed
    // to keep at once.
    connectionLimit: 5,
    // [END cloud_sql_mysql_mysql_limit]

    // [START cloud_sql_mysql_mysql_timeout]
    // 'connectTimeout' is the maximum number of milliseconds before a timeout
    // occurs during the initial connection to the database.
    connectTimeout: 10000, // 10 seconds
    // 'acquireTimeout' is the maximum number of milliseconds to wait when
    // checking out a connection from the pool before a timeout error occurs.
    acquireTimeout: 10000, // 10 seconds
    // 'waitForConnections' determines the pool's action when no connections are
    // free. If true, the request will queued and a connection will be presented
    // when ready. If false, the pool will call back with an error.
    waitForConnections: true, // Default: true
    // 'queueLimit' is the maximum number of requests for connections the pool
    // will queue at once before returning an error. If 0, there is no limit.
    queueLimit: 0, // Default: 0
    // [END cloud_sql_mysql_mysql_timeout]

    // [START cloud_sql_mysql_mysql_backoff]
    // The mysql module automatically uses exponential delays between failed
    // connection attempts.
    // [END cloud_sql_mysql_mysql_backoff]
  }
  return await createUnixSocketPool(config);
    
};
// [END cloud_sql_mysql_mysql_create]


let pool;
const poolPromise = createPool()
  .then(async (pool) => {
    return pool;
  })
  .catch((err) => {
    console.log(err);
    process.exit(1)
  });

app.use(async (req, res, next) => {
  if (pool) {
    return next();
  }
  try {
    pool = await poolPromise;
    next();
  }
  catch (err) {
    console.log(err);
    return next(err);
  }
});





// [START getting_started_auth_front_controller]
app.get('/', async (req, res) => {
  console.log("hitting.......");
  //const assertion = req.header('X-Goog-IAP-JWT-Assertion');
  // let email = 'None';
  let emailAddrss = 'None';
  // try {
  //   const info = await validateAssertion(assertion);
  //   email = info.email;
  // } catch (error) {
  //   console.log(error);
  // }
  // [START cloud_sql_mysql_mysql_connection]
  try {
    const stmt = 'SELECT * FROM VeverseDB.Users';
    // Pool.query automatically checks out, uses, and releases a connection
    // back into the pool, ensuring it is always returned successfully.
    emailAddrss = await pool.query(stmt);
  } catch (err) {
    // If something goes wrong, handle the error in this section. This might
    // involve retrying or adjusting parameters depending on the situation.
    // [START_EXCLUDE]
    console.log(err);
    return res
      .status(501)
      .send(
        'Unable to successfully cast vote! Please check the application logs for more details.'
      )
      .end();
    // [END_EXCLUDE]
  }

  // [END cloud_sql_mysql_mysql_connection]
  let emailStr={} ;
  // [END cloud_sql_mysql_mysql_connection]
  emailAddrss.forEach(element => {
    emailStr[element.emailID] = {"first_name" : element.first_name,
                                  "last_name" : element.last_name};
  });
  console.log(JSON.stringify(emailStr));
  res.end(JSON.stringify(emailStr));
});

app.get('/recommendations/:pageNum', async (req, res) => {
  
  const perPageVideoCount = 15;
  let jsonResult = {"results" : []};
  let pageNum = (req.params.pageNum - 1) * perPageVideoCount;
  try {
    const stmt = `SELECT videoID,thumbnail_path,title,views,date,video_path FROM VeverseDB.Video order by views desc limit ${pageNum},${perPageVideoCount};`;
    // Pool.query automatically checks out, uses, and releases a connection
    // back into the pool, ensuring it is always returned successfully.
    let queryObj = await pool.query(stmt);

    //Populating Results
    queryObj.forEach(row => {
      jsonResult["results"].push({
        "videoID": row["videoID"],
        "thumbnail_path":row["thumbnail_path"] ,
        "title": row["title"],
        "views":row["views"],
        "date": row["date"],
        "video_path": row["video_path"]
      });
    });
    res.end(JSON.stringify(jsonResult));
  } catch (err) {
    // If something goes wrong, handle the error in this section. This might
    // involve retrying or adjusting parameters depending on the situation.
    // [START_EXCLUDE]
    console.log(err);
    return res
      .status(501)
      .send(
        'Unable to successfully cast vote! Please check the application logs for more details.'
      )
      .end();
    // [END_EXCLUDE]
  }
  
});
app.post('/registration/', async (req, res) => {
  
  var emailID = req.body.emailID;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  try {
    const stmt = `INSERT INTO VeverseDB.Users (emailID, first_name, last_name) VALUES (${emailID}, ${first_name}, ${last_name});`
    // Pool.query automatically checks out, uses, and releases a connection
    // back into the pool, ensuring it is always returned successfully.
    pool.query(stmt);
    res.end('registration successfull');
  } catch (err) {
    // If something goes wrong, handle the error in this section. This might
    // involve retrying or adjusting parameters depending on the situation.
    // [START_EXCLUDE]
    console.log(err);
    return res
      .status(501)
      .send(
        'Unable to register.'
      )
      .end();
    // [END_EXCLUDE]
  }
  
});
app.post('/search/videos', async (req, res) => {
  console.log("hitting search");
  //return res.send("working");
  var key1 = req.body.key1;
  var key2 = req.body.key2;
  var key3 = req.body.key3;
  

  let jsonResult = {"results" : []};
  try {
    const stmt = `SELECT distinct  Video.videoID,thumbnail_path,title,views,date,video_path,likes 
    FROM  VeverseDB.Video 
    inner join VeverseDB.VideoTags on Video.videoID=VideoTags.videoID
    where  tagName='${key1}' or tagName='${key2}' or tagName='${key3}' ;`;
    // Pool.query automatically checks out, uses, and releases a connection
    // back into the pool, ensuring it is always returned successfully.
    let queryObj = await pool.query(stmt);
    queryObj.forEach(row => {
      jsonResult["results"].push({
        "videoID": row["videoID"],
        "thumbnail_path":row["thumbnail_path"] ,
        "title": row["title"],
        "views":row["views"],
        "date": row["date"],
        "likes":row["likes"],
        "video_path": row["video_path"]
      });
    });
    res.end(JSON.stringify(jsonResult));
  } catch (err) {
    // If something goes wrong, handle the error in this section. This might
    // involve retrying or adjusting parameters depending on the situation.
    // [START_EXCLUDE]
    console.log(err);
    return res
      .status(501)
      .send(
        'Unable to register.'
      )
      .end();
    // [END_EXCLUDE]
  }
  
});

// [END getting_started_auth_front_controller]

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

// [END getting_started_auth_all]

module.exports = app;
