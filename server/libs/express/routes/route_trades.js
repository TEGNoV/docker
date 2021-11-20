const express = require('express');
const route_index = express.Router();
const path = require("path")
const trades = require(path.join(__dirname, "../../moduls/trades/trades"));

const log = require("../../moduls/logging/log")
const MODUL = "route_trades.js"
const LEVEL = 10

route_index.get('/api/trades', async (req, res) => {
    const FUNCTION = "/api/trades"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "Route","DEBUG")
  
    if(req.isAuthenticated()){
        log.log("req.query.filter: " + req.query.filter  , MODUL, FUNCTION, LEVEL, "Value","DEBUG")
        log.log("req.query.startTime : " + req.query.startTime  , MODUL, FUNCTION, LEVEL, "Value","DEBUG")
        log.log("req.query.endTime: " + req.query.endTime  , MODUL, FUNCTION, LEVEL, "Value","DEBUG")
        log.log("req.query.settings: " + req.query.settings  , MODUL, FUNCTION, LEVEL, "Value","DEBUG")
        let ret = await trades.getTrades(req.query.filter , req.query.startTime  , req.query.endTime , JSON.parse(req.query.settings))
        console.log(ret)
        res.send(
            ret 
        )
    }else{
        console.log("No Login")
    }
}) 
module.exports = route_index;