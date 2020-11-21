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
    const stmt = `(select videoID,title, views, likes, veverseMySqlDatabase.Video.category, video_path, thumbnail_path, first_name, last_name, profile_pic,date from veverseMySqlDatabase.Users, veverseMySqlDatabase.Video inner join 
    (select distinct category, GROUP_CONCAT(videoID ORDER BY views DESC) grouped_videos from veverseMySqlDatabase.Video 
		where ${emailStr} videoID in 
		  (select videoID from veverseMySqlDatabase.History) 
		  group by category 
		  Order by count(*) 
		  limit 4 
	    ) v2 
    on v2.category = veverseMySqlDatabase.Video.category
    where veverseMySqlDatabase.Video.emailID = veverseMySqlDatabase.Users.emailID 
	  AND FIND_IN_SET(videoID, grouped_videos) BETWEEN ${(10*(pageNum - 1)) + 1} AND ${(10*(pageNum - 1)) + 10} 
    ) union 
    (select videoID, title, views, likes, veverseMySqlDatabase.Video.category, video_path, thumbnail_path, first_name, last_name, profile_pic,date from veverseMySqlDatabase.Users, veverseMySqlDatabase.Video
    where veverseMySqlDatabase.Video.emailID = veverseMySqlDatabase.Users.emailID 
    order by veverseMySqlDatabase.Video.views and veverseMySqlDatabase.Video.likes
    ) 
    limit 20
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