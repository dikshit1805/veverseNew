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

const multer = require('multer')
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 100mb.
    fileSize: 100 * 1024 * 1024,
  },
});
const uploadFile = require('./helpers/helpers')






const app = express();
//for cors
app.use(cors());
//for upload
app.disable('x-powered-by')
app.use(multerMid.array('file'))


//const oAuth2Client = new OAuth2Client();
app.set('view engine', 'pug');
app.enable('trust proxy');

// Automatically parse request body as form data.

app.use(bodyParser.urlencoded({limit:'100mb',extended: true} ));
app.use(bodyParser.json({limit:'100mb'}));


// Set Content-Type for all responses for these routes.
app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.set('Content-Type', 'application/json');
  next();
});





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








app.post('/registration/', async (req, res) => {
  
  var emailID = req.body.emailID;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  try {
    const stmt = `INSERT INTO veverseMySqlDatabase.Users (emailID, first_name, last_name) VALUES (${emailID}, ${first_name}, ${last_name});`
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
    FROM  veverseMySqlDatabase.Video 
    inner join veverseMySqlDatabase.VideoTags on Video.videoID=VideoTags.videoID
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
        "video_path": row["video_path"],
        "likes":row["likes"]
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




app.post("/upload/save/file", async (req, res) => {

  try {
    const myFile = req.file
    console.log("request received",myFile);

    uploadFile(myFile).then((fileToBeUploaded) => {
      console.log('Do this');
      return res.status(200).json({
        success: true,
        filePath: fileToBeUploaded
      })
  })
  .catch((error) => {
    return res.status(500).json({ success: false, error:error })
  })
    
  } catch (error) {
   return res.status(500).json({success:false,error:"something went wrong"})
  }
});

app.post('/upload/video/save', async(req, res) => {
 
  console.log("hitting saving video to db");
  //console.log('requestBody: ', req.body)
  

 
  var user = req.body.user;
  var title = req.body.title;
  var description = req.body.description;
  var date = req.body.date;
  var views = req.body.views;
  var likes = req.body.likes;
  var categories = req.body.categories;
  var files = req.files;

  //console.log("request: ", JSON.stringify(req.body)req)
  console.log("request body: ", JSON.stringify(req.body))
  console.log("request file: ", JSON.stringify(req.files))
  
  try {
    var videoPath ="fg";
    var thumbNailPath = "fgsfg";
    var stmt = `INSERT INTO veverseMySqlDatabase.Video (videoID, title, description,date,views,likes,category,video_path,thumbnail_path,emailID)
    VALUES (null, '${title}', '${description}','${date}','${views}','${likes}','${categories}','${videoPath}','${thumbNailPath}','${user}' );`;
    // console.log("sql query",stmt);
    await pool.query(stmt);
    var selectVideoId = `select max(videoID) as videoID from veverseMySqlDatabase.Video;`;
    let resultSql = await pool.query(selectVideoId);
   
    const videoID = resultSql[0].videoID;
    
    await uploadFile(files[0],videoID).then((fileToBeUploaded) => {
      console.log('Do this');
      videoPath= fileToBeUploaded
    }).catch((error) => {
      var deleteVideo = `DELETE FROM veverseMySqlDatabase.Video where videoID=${videoID}`;
      pool.query(deleteVideo);
      console.log('deleting file');
      return res.status(500).json({ success: false, error:error }).end();
    })
    await uploadFile(files[1],videoID).then((fileToBeUploaded) => {
      console.log('Do this');
      thumbNailPath= fileToBeUploaded
      console.log("filetoBeUploaded",fileToBeUploaded+"  thumbNailPath",thumbNailPath);
      
  }).catch((error) => {
      var deleteImage= `DELETE FROM veverseMySqlDatabase.Video where videoID=${videoID}`;
      pool.query(deleteImage);
      console.log('deleting file');
      return res.status(500).json({ success: false, error:error }).end();
    })

    console.log("videoPatg",videoPath);
    console.log("imagePath",thumbNailPath);
    var updateVideoRow= `UPDATE veverseMySqlDatabase.Video SET video_path = '${videoPath}', thumbnail_path = '${thumbNailPath}' WHERE videoID=${videoID};`;
    pool.query(updateVideoRow);
    return res.status(200).json({
      success: true,
      videoPath:videoPath,
      imagePath:thumbNailPath
    }).end();
    
  } catch (err) {
    
    console.log(err);
    return res
      .status(501)
      .send(
        'Unable to upload.'
      )
      .end();
   
  }
  
});
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

// [END getting_started_auth_all]

module.exports = app;
