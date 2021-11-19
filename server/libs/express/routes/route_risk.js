const express = require('express');
const route_index = express.Router();
const path = require("path")
const stats = require(path.join(__dirname, "../../moduls/dashboard/dashboard"));

const log = require("../../moduls/logging/log")
const MODUL = "route_risk.js"
const LEVEL = 10


route_index.get('/api/getDayRisk', async (req, res) => {
    const FUNCTION = "/api/getDayRisk"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")
    if(req.isAuthenticated()){
            let ret = await stats.getDayRisk()
            res.send(
                ret 
            )
    }else{
        log.log("No Login" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
    }
})
route_index.get('/api/setPositionIgnore', async (req, res) => {
    const FUNCTION = "/api/setPositionIgnore"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")
    if(req.isAuthenticated()){
        if(req.query.myValues == undefined){
            log.log("Options are mendetory" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
        }else{
            let values = JSON.parse(req.query.myValues)
            let id = values.id
            let ignore = values.ignore
            let ret = await stats.setPositionIgnore(id ,ignore )
            res.send(
                ret 
            )
        }
    }else{
        log.log("No Login" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
    }
})

module.exports = route_index;