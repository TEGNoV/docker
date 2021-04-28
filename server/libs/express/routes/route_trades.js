const express = require('express');
const route_index = express.Router();
const path = require("path")
const trades = require(path.join(__dirname, "../../moduls/trades/trades"));

route_index.get('/api/trades', async (req, res) => {
    if(req.isAuthenticated()){

        let ret = await trades.getTrades(req.query.filter , req.query.startTime  , req.query.endTime , JSON.parse(req.query.settings))
       
        res.send(
            ret 
        )
       
    }else{
        console.log("No Login")
    }

}) 

module.exports = route_index;