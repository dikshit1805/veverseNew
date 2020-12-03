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

// history
app.post('/log', async (req, res) => {
  let emailID = req.body.emailID;
  let videoID = req.body.videoID;
  let like = 0;
  try {
    let stmt =`select LIKED from veverseMySqlDatabase.History where history_index in (select history_index from (select history_index 
                      from veverseMySqlDatabase.History where videoID='${videoID}' and emailID='${emailID}' order by history_index desc limit 1) v1)`
    console.log(stmt)
    let queryObj = await pool.query(stmt);
    try {
      like = queryObj[0]['LIKED']
      console.log("pass", like)
    }catch{
      like = 0
      console.log("fail", like)
    }
    stmt = `INSERT INTO veverseMySqlDatabase.History (emailID, videoID, LIKED) VALUES ('${emailID}', '${videoID}', '${like}');`
    console.log(stmt)
    // Pool.query automatically checks out, uses, and releases a connection
    // back into the pool, ensuring it is always returned successfully.
    pool.query(stmt);
    stmt = `UPDATE veverseMySqlDatabase.Video SET views=views+1 where videoID='${videoID}'`
    console.log(stmt)
    // Pool.query automatically checks out, uses, and releases a connection
    // back into the pool, ensuring it is always returned successfully.
    pool.query(stmt);

    res.json({"like":like}).end(stmt);
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

// Like
app.post('/like', async (req, res) => {
  let emailID = req.body.emailID;
  let videoID = req.body.videoID;

  try {
    let stmt = `UPDATE veverseMySqlDatabase.History SET LIKED=1
    where history_index IN 
    (select history_index from 
      (select history_index from veverseMySqlDatabase.History 
      where videoID=${videoID} and emailID='${emailID}' 
        order by history_index desc 
        limit 1) v2
    );`
    pool.query(stmt);
    stmt = `UPDATE veverseMySqlDatabase.Video SET likes=likes+1  where videoID='${videoID}'`

    // Pool.query automatically checks out, uses, and releases a connection
    // back into the pool, ensuring it is always returned successfully.
    pool.query(stmt);
    res.end(stmt);
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

app.post('/unlike', async (req, res) => {
  let emailID = req.body.emailID;
  let videoID = req.body.videoID;

  try {
    let stmt = `UPDATE veverseMySqlDatabase.History SET LIKED=0
    where history_index IN 
    (select history_index from 
      (select history_index from veverseMySqlDatabase.History 
      where videoID=${videoID} and emailID='${emailID}' 
        order by history_index desc 
        limit 1) v2
    );`
    // Pool.query automatically checks out, uses, and releases a connection
    // back into the pool, ensuring it is always returned successfully.
    pool.query(stmt);
    stmt = `UPDATE veverseMySqlDatabase.Video SET likes=likes-1  where videoID='${videoID}'`
    pool.query(stmt);
    res.end(stmt);
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


const PORT =  5555;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


module.exports = {
    app
};