const express = require('express');
const route_index = express.Router();
const path = require("path")
const comment = require(path.join(__dirname, "../../moduls/comment/comment"));
const log = require("../../moduls/logging/log")
const bodyParser = require('body-parser')  
var fs = require('fs');
var jsonParser = bodyParser.json()

route_index.get('/api/getComment', async (req, res) => {
    if(req.isAuthenticated()){
        let ret = await comment.getCommentByID(req.query.id )
        res.send(
            ret 
        )
    }else{
        console.log("No Login")
    }
}) 
route_index.post('/api/writeComment', jsonParser, async function  (req, res) {
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
    const ret = await comment.writeComment(myJ)
    res.send(
      ret
    )
  })

  route_index.post('/api/updateComment', jsonParser, async function  (req, res) {
   
  })

module.exports = route_index;