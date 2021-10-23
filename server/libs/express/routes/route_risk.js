const express = require('express');
const route_index = express.Router();
const path = require("path")
const stats = require(path.join(__dirname, "../../moduls/dashboard/dashboard"));



route_index.get('/api/getDayRisk', async (req, res) => {
    if(req.isAuthenticated()){
            let ret = await stats.getDayRisk()
            res.send(
                ret 
            )
    }else{
        console.log("No Login")
    }
})
route_index.get('/api/setPositionIgnore', async (req, res) => {
    if(req.isAuthenticated()){
        if(req.query.myValues == undefined){
            console.log("Options are mendetory")
        }else{
            let values = JSON.parse(req.query.myValues)
            let id = values.id
            let ignore = values.ignore
            console.log(values)
            let ret = await stats.setPositionIgnore(id ,ignore )
            res.send(
                ret 
            )
        }
    }else{
        console.log("No Login")
    }
})

module.exports = route_index;