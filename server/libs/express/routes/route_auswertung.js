const express = require('express');
const route_index = express.Router();
const path = require("path")
const trades = require(path.join(__dirname, "../../moduls/auswertung/auswertung"));

route_index.get('/api/getRiskBasedResult', async (req, res) => {
    if(req.isAuthenticated()){
        let ret = await trades.getRiskBasedResult(req.query)
        console.log(ret)
        res.send(
            ret 
        )
    }else{
        console.log("No Login")
    }

}) 

module.exports = route_index;