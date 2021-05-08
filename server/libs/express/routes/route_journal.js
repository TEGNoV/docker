const express = require('express');
var zip = require('express-zip');
const route_index = express.Router();
const path = require("path")
const journal = require(path.join(__dirname, "../../moduls/journal/journal"));
var archiver = require('archiver');
const fs = require('fs')
zip = require('express-easy-zip');

const bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()


route_index.get('/api/journal', async (req, res) => {
  if (req.isAuthenticated()) {
  
  
    let ret = await journal.getAllJournal(req.query.startTime, req.query.endTime)
  
    res.send(ret)
   
  } else {
    console.log("no Login")
  }
})



route_index.get('/api/getSinglePictures', async (req, res) => {
  if (req.isAuthenticated()) {
    let ret = await journal.getSinglePictures(req.query.id)
    res.send( ret)
  } else {
    console.log("no Login")
  }
})

route_index.get('/api/getSingleJournal', async (req, res) => {
  if (req.isAuthenticated()) {
    let ret = await journal.getSingleJournal(req.query.journalid)
    console.log("ret")
    console.log(ret)
    res.send(
      ret
    )
  } else {
    console.log("no Login")
  }
})




module.exports = route_index;