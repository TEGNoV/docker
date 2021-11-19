const express = require('express');
const route_index = express.Router();
const path = require("path")
const stats = require(path.join(__dirname, "../../moduls/dashboard/dashboard"));

const log = require("../../moduls/logging/log")
const MODUL = "route_dashboard.js"
const LEVEL = 10

route_index.get('/api/getTargetChart', async (req, res) => {
    const FUNCTION = "/api/getTargetChart"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")

    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            log.log("Options are mendetory" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getTargetChart(options)
            res.send(
                ret 
            )
        }
    }else{
        log.log("No Login" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
    }
})

route_index.get('/api/overview', async (req, res) => {
    const FUNCTION = "/api/overview"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")    
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            log.log("Options are mendetory" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getCurrentDailyStats(options)
            res.send(
                ret 
            )
        }
    }else{
        log.log("No Login" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
    }
})

route_index.get('/api/getPerformanceLineFlow', async (req, res) => {
    const FUNCTION = "/api/getPerformanceLineFlow"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")      
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            log.log("Options are mendetory" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getPerformanceLineFlow(options)
            res.send(
                ret 
            )
        }
    }else{
        log.log("No Login" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
    }
})

route_index.get('/api/getPerformanceLine', async (req, res) => {
    const FUNCTION = "/api/getPerformanceLine"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")     
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            log.log("Options are mendetory" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getPerformanceLine(options)
            res.send(
                ret 
            )
        }
    }else{
        log.log("No Login" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
    }
})

route_index.get('/api/getWinlossdistribution', async (req, res) => {
    const FUNCTION = "/api/getWinlossdistribution"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")        
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            log.log("Options are mendetory" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getWinlossdistribution(options)
            res.send(
                ret 
            )
        }
    }else{
        log.log("No Login" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
    }
})

route_index.get('/api/getWinlosspercentile', async (req, res) => {
    const FUNCTION = "/api/getWinlossdistribution"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")       
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            log.log("Options are mendetory" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getWinlosspercentile(options)
            res.send(
                ret 
            )
        }
    }else{
        log.log("No Login" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
    }
})

route_index.get('/api/dashboardStats', async (req, res) => {
    const FUNCTION = "/api/dashboardStats"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")       
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            log.log("Options are mendetory" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getDashboardStats(options)
            res.send( ret )
        }
    }else{
        log.log("No Login" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
    }
})

route_index.get('/api/getKontostand', async (req, res) => {
    const FUNCTION = "/api/getKontostand"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")       
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            log.log("Options are mendetory" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getKontostand(options)
            res.send(
                ret 
            )
        }
    }else{
        log.log("No Login" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
    }
})


route_index.get('/api/getTargets', async (req, res) => {
    const FUNCTION = "/api/getTargets"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")        
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            log.log("Options are mendetory" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
        }else{
     
            let options = JSON.parse(req.query.options)
            let ret = await stats.getTargets(options)
            res.send(
                ret 
            )
        }
    }else{
        log.log("No Login" , MODUL, FUNCTION, LEVEL, "EntryExit","ERROR")
    }
})


module.exports = route_index;