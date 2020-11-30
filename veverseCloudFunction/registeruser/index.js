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
  let emailID = req.body.emailID;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let profile_pic = req.body.profile_pic;
  if(!profile_pic) {
    profile_pic="https://www.kindpng.com/picc/m/353-3534825_cool-profile-avatar-picture-cool-profile-hd-png.png"
  }
  try {
    const stmt = `INSERT INTO veverseMySqlDatabase.Users (emailID, first_name, last_name, profile_pic) VALUES ('${emailID}', '${first_name}', '${last_name}', '${profile_pic}');`
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

// Home Page
app.get('/:userID', async (req, res) => {
  let userID = req.params.userID;

  try {
    let jsonResult = {"results" : []};
    const stmt = `select * from  veverseMySqlDatabase.Users where emailID = ${userID};`
    let queryObj = await pool.query(stmt);
    queryObj.forEach(row => {
      jsonResult["results"].push({
        "emailID": row["emailID"],
        "first_name" : row["first_name"],
        "last_name" : row["last_name"],
        "profile_pic" : row["profile_pic"]
      });
    });
    res.end(JSON.stringify(jsonResult));
  } catch (err) {
    console.log(err);
    return res
      .status(501)
      .send(`Error: ${err}`)
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