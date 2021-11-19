const express = require('express');
const route_index = express.Router();
const path = require("path")
const journal = require(path.join(__dirname, "../../moduls/journal/journal"));
const log = require("../../moduls/logging/log")

const bodyParser = require('body-parser')  
var fs = require('fs');
 


// create application/json parser
var jsonParser = bodyParser.json()


// POST /api/users gets JSON bodies
route_index.post('/api/JournalUpdateCreate', jsonParser, async function  (req, res) {
  /*const myJ = {
    typ:            req.body.typ,
    historyMAP:     req.body.historyMAP,
    period:         req.body.period,
    strategy:       req.body.strategy,
    symbol:         req.body.symbol, 
    buyexecution:   req.body.buyexecution,
    sellexecution:  req.body.sellexecution,
    myentry: req.body.myentry,
    myentryline: req.body.myentryline,
    myexit: req.body.myexit,
    journalId:      req.body.journalId
  }*/

  const myJ = req.body
  console.log(myJ)
  let ret
  try{
    if(myJ.typ == "create"){
      ret = await journal.createInitalJournalEntry(myJ)
    }else if(myJ.typ == "update") {
      ret = await journal.updateJournalEntry(myJ)
    }
     
  }catch(e){
    ret = e
  }
  
  res.send(
    ret
  )
})

const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
route_index.use(fileUpload({
  createParentPath: true
}));

// POST /api/users gets JSON bodies
route_index.post('/api/upload', jsonParser, async function  (req, res) {
  console.log("recieved upload")
  let avatar = req.files.file;
  avatar.mv(path.join(__dirname, "../../../IMPORT/" + avatar.name))
  const myJ = {
    journalId:req.body.journalId,
  }
  const ret = await journal.deleteSingleJournal(myJ)
  res.send(
    ret
  )
})

route_index.post('/api/picUpload', jsonParser, async function  (req, res) {
  let myFile = req.files.file;
  const extention = path.extname(myFile.name)
  let randomId =  Date.now()
  randomId = randomId.toString()
  randomId = randomId.substring(randomId.length-8)
  const newname = req.body.journalId + "_" + req.body.historyId + "_" + randomId

  if(checkPicture(extention)){
    if(checkAlreadyExists()){
      await myFile.mv(    path.join(__dirname, "../../../TEMP/"   + myFile.name))
      await fs.renameSync(path.join(__dirname, "../../../TEMP/"   + myFile.name) , path.join(__dirname, "../../../IMPORT/" + newname + extention ) );
    }
  }
  
})

// POST /api/users gets JSON bodies
route_index.post('/api/deleteSingleJournal', jsonParser, async function  (req, res) {
  const myJ = {
    journalId:req.body.journalId,
  }
  const ret = await journal.deleteSingleJournal(myJ)
  res.send(
    ret
  )
})

// POST /api/users gets JSON bodies
route_index.post('/api/unlinkHistory', jsonParser, async function  (req, res) {
  const myJ = {
    journalId:req.body.journalId,
    historyId:req.body.historyId
  }
  const ret = await journal.unlinkHistory(myJ)
  res.send(
    ret
  )
})


function checkPicture(ext){
  if(ext == ".png"){return true}
  if(ext == ".jpg"){return true}
  return false
}

function checkAlreadyExists(filepath){
  return true
}


module.exports = route_index;