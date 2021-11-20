const myDB = require('../../database/database');
const myTime = require('../../moduls/time/myTime');
const log = require("../../moduls/logging/log")
const MODUL = "Risk.js"
const LEVEL = 1001

function extrapolate(limit, lineChartData) {
    const FUNCTION = "extrapolate"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")
    return lineChartData
}

exports.extrapolate = extrapolate