'use strict';

const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const { poolPromise} = require('./db');

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

// profile
app.get('/profile_pic/', async (req, res) => {
  let emailID = req.query.emailID;
  let profile_pic = "";
  try {
    let stmt =`select profile_pic from veverseMySqlDatabase.Users where emailID='${emailID}'`
    let queryObj = await pool.query(stmt);
    try {
      profile_pic = queryObj[0]['profile_pic']
      console.log("pass", profile_pic)
    }catch{
      profile_pic = ''
      console.log("fail", profile_pic)
    }
    res.json({"profile_pic":profile_pic}).end(stmt);
  } catch (err) {
    // If something goes wrong, handle the error in this section. This might
    // involve retrying or adjusting parameters depending on the situation.
    console.log(err);
    return res
      .status(501)
      .send(
        'Unable to register.'
      )
      .end();
  }
  
});


// Home Page
app.get('/', async (req, res) => {
  let queryOut = 'None';
  let pageNum = req.query.pageNum;
  let emailID = req.query.emailID;
  let emailStr = `emailID = '${emailID}' and` 
  if(pageNum === undefined) {
    pageNum = 1;
  }
  if(emailID === undefined) {
    emailStr = ''
  }
  try {
    const stmt = `select  distinct videoID, title, views, likes, category, 
    video_path, thumbnail_path, first_name, last_name, profile_pic, date from veverseMySqlDatabase.Users U, veverseMySqlDatabase.Video V
    where U.emailID = V.emailID and U.emailID='${emailID}' limit 20
    offset ${(20*(pageNum - 1))}`
    queryOut = await pool.query(stmt);
  } catch (err) {
    res.status(501).send('No Users Found.').end();
  }
  let jsonResult = {"results" : []};
  queryOut.forEach(element => {
    jsonResult["results"].push({
      "videoID" : element.videoID,
      "title" : element.title,
      "views" : element.views, 
      "likes" : element.likes,
      "category" : element.category, 
      "video_path" : element.video_path, 
      "thumbnail_path" : element.thumbnail_path,
      "first_name" : element.first_name,
      "last_name" : element.last_name,
      "profile_pic" : element.profile_pic,
      "date" : element.date
      });
  });
  res.end(JSON.stringify(jsonResult));
});

const PORT =  5555;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


module.exports = {
    app
};