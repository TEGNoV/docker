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



module.exports = route_index;