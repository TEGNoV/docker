const express = require('express');
var zip = require('express-zip');
const route_index = express.Router();
const path = require("path")

const log = require("../../moduls/logging/log")

const bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()


route_index.get('/api/getLog', async (req, res) => {
  if (req.isAuthenticated()) {
    let ret = await log.getLog()
    res.send(ret)
   
  } else {
    console.log("no Login")
  }
})



module.exports = route_index;