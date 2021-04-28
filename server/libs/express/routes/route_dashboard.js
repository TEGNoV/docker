const express = require('express');
const route_index = express.Router();
const path = require("path")
const stats = require(path.join(__dirname, "../../moduls/dashboard/dashboard"));



route_index.get('/api/getTargetChart', async (req, res) => {
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            console.log("Options are mendetory")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getTargetChart(options)
            res.send(
                ret 
            )
        }
    }else{
        console.log("No Login")
    }
})



route_index.get('/api/overview', async (req, res) => {
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            console.log("Options are mendetory")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getCurrentDailyStats(options)
            res.send(
                ret 
            )
        }
    }else{
        console.log("No Login")
    }
})


route_index.get('/api/getPerformanceLineFlow', async (req, res) => {
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            console.log("Options are mendetory")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getPerformanceLineFlow(options)
            res.send(
                ret 
            )
        }
    }else{
        console.log("No Login")
    }
})

route_index.get('/api/getPerformanceLine', async (req, res) => {
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            console.log("Options are mendetory")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getPerformanceLine(options)
            res.send(
                ret 
            )
        }
    }else{
        console.log("No Login")
    }
})

route_index.get('/api/getWinlossdistribution', async (req, res) => {
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            console.log("Options are mendetory")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getWinlossdistribution(options)
            res.send(
                ret 
            )
        }
    }else{
        console.log("No Login")
    }
})

route_index.get('/api/getWinlosspercentile', async (req, res) => {
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            console.log("Options are mendetory")
        }else{
            let options = JSON.parse(req.query.options)
            let ret = await stats.getWinlosspercentile(options)
            res.send(
                ret 
            )
        }
    }else{
        console.log("No Login")
    }
})





route_index.get('/api/dashboardStats', async (req, res) => {
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            console.log("Options are mendetory!!! dashboardStats")
        }else{
            console.log("-----------------------------")
            console.log(req.query.options)
            let options = JSON.parse(req.query.options)
            let ret = await stats.getDashboardStats(options)
            res.send( ret )
        }
    }else{
        console.log("No Login")
    }
})

route_index.get('/api/getKontostand', async (req, res) => {
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            console.log("Options are mendetory!!! getKontostand")
        }else{
            console.log("-----------------")
            console.log(req.query.options)
            let options = JSON.parse(req.query.options)
            let ret = await stats.getKontostand(options)
            res.send(
                ret 
            )
        }
    }else{
        console.log("No Login")
    }
})


route_index.get('/api/getTargets', async (req, res) => {
    if(req.isAuthenticated()){
        if(req.query.options == undefined){
            console.log("Options are mendetory!!! getTargets")
        }else{
     
            let options = JSON.parse(req.query.options)
            let ret = await stats.getTargets(options)
            res.send(
                ret 
            )
        }
    }else{
        console.log("No Login")
    }
})


module.exports = route_index;