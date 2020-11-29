'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { poolPromise} = require('./db');
 
let cors = require('cors');


const app = express();
app.use(cors());;
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


let pool;
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


// Home Page
app.post('/', async (req, res) => {
  let key = req.body.key;
  let pageNum = req.query.pageNum;
  if(pageNum === undefined) {
    pageNum = 1;
  }

  try {
    let keyStr = key.split(" ").map(element => 
      (`V.title LIKE '%${element}%' or VT.tagName LIKE '%${element}%' or V.description LIKE '%${element}%' or U.first_name LIKE '%${element}%' or U.last_name  LIKE '%${element}%'`)).join(" or ");  
    let jsonResult = {"results" : []};
    const stmt = `select V.videoID,V.category,U.profile_pic, thumbnail_path, title,views,date,likes,video_path,first_name,last_name,tagName 
    from  veverseMySqlDatabase.Users U, veverseMySqlDatabase.Video V left join  veverseMySqlDatabase.VideoTags VT 
    on V.videoID = VT.videoID where V.emailID = U.emailID  and (${keyStr}) limit 20
    offset ${(20*(pageNum - 1))}`;
    let queryObj = await pool.query(stmt);
    queryObj.forEach(row => {
      jsonResult["results"].push({
        "videoID": row["videoID"],
        "thumbnail_path":row["thumbnail_path"] ,
        "title": row["title"],
        "views":row["views"],
        "date": row["date"],
        "likes":row["likes"],
        "video_path": row["video_path"],
        "first_name" : row["first_name"],
        "last_name" : row["last_name"],
        "tagName" : row["tagName"],
        "profile_pic" : row["profile_pic"]
      });
    });
    res.end(JSON.stringify(jsonResult));
  } catch (err) {
    console.log(err);
    return res
      .status(501)
      .send(`No video with the search string ${key}. \n Error: ${err}`)
      .end();
  }
});

// Home Page
app.get('/:videoID', async (req, res) => {
  let videoID = req.params.videoID;
  if(videoID === undefined) {
    videoID = 1;
  }

  try {
    let jsonResult = {"results" : []};
    const stmt = `select V.videoID,V.category,U.profile_pic, thumbnail_path, title,views,date,likes,video_path,first_name,last_name,tagName from  veverseMySqlDatabase.Users U, veverseMySqlDatabase.Video V left join  veverseMySqlDatabase.VideoTags VT on V.videoID = VT.videoID where V.emailID = U.emailID and V.videoID='${videoID}';`
    let queryObj = await pool.query(stmt);
    queryObj.forEach(row => {
      jsonResult["results"].push({
        "videoID": row["videoID"],
        "thumbnail_path":row["thumbnail_path"] ,
        "title": row["title"],
        "views":row["views"],
        "date": row["date"],
        "likes":row["likes"],
        "category": row["category"],
        "video_path": row["video_path"],
        "first_name" : row["first_name"],
        "last_name" : row["last_name"],
        "tagName" : row["tagName"],
        "profile_pic" : row["profile_pic"],
        "firebaseVideoUrl":"Video/" +  row["videoID"] +"/Video.mp4"
      });
    });
    res.end(JSON.stringify(jsonResult));
  } catch (err) {
    console.log(err);
    return res
      .status(501)
      .send(`No video with the search string ${key}. \n Error: ${err}`)
      .end();
  }
});


const PORT =  5555;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


module.exports = {
    app
};