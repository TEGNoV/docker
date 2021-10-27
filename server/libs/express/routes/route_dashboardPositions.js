const express = require('express');
const route_index = express.Router();
const path = require("path")
const stats = require(path.join(__dirname, "../../moduls/dashboard/dashboard"));

route_index.get('/api/dashboardPositions', async (req, res) => {
    if(req.isAuthenticated()){
    let ret = await stats.getPositions()
    res.send(
        ret
    )}else{
        console.log("no Login")
    }
}) 
module.exports = route_index;