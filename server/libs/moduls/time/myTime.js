const myDB = require('../../database/database');
const log = require("../logging/log")
const MODUL = "Time.js"
const LEVEL = 1001

const getWeekTimes = async ( ) => {
    var start = new Date(await this.getTimestampToday());
    for (i = 0; i < 8; i++) {
        var n = start.getDay()
        if (n == 1) {
            start.setHours(0, 0, 0, 0);
        } else {
            start.setDate(start.getDate() - 1);
        }
    }
    var end = new Date(start.getTime())
    end.setDate(end.getDate() + 5)
    return {end: end.getTime(), start: start.getTime()}
}

const getYesterdayTimes = async ( ) => {
    const FUNCTION = "getDayTimes"
    let start = new Date(await this.getTimestampToday())
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    var end = new Date(await this.getTimestampToday());
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999);
    log.log("end.getTime(): " + end.getTime()  , MODUL, FUNCTION, LEVEL, "MSG","DEBUG")
    return {end: end.getTime(), start: start.getTime()}
}

const getDayTimes = async ( ) => {
    const FUNCTION = "getDayTimes"
    let start = new Date(await this.getTimestampToday())
    start.setHours(0, 0, 0, 0);
    var end = new Date(await this.getTimestampToday());
    end.setHours(23, 59, 59, 999);
    log.log("end.getTime(): " + end.getTime()  , MODUL, FUNCTION, LEVEL, "MSG","DEBUG")
    return {end: end.getTime(), start: start.getTime()}
}


const getMonthTimes = async ( ) => {
    var date = new Date(await this.getTimestampToday())
    y = date.getFullYear() 
    m = date.getMonth();
    var start = new Date(y, m, 1);
    var end = new Date(await this.getTimestampToday());
    end.setHours(23, 59, 59, 999);
    return {end: end.getTime(), start: start.getTime()}
}

const getYearTimes = async ( ) => {
    var yearStart = "2021-01-01"
    var start = new Date(yearStart);
    var end = new Date(await this.getTimestampToday());
    end.setHours(23, 59, 59, 999);
    return {end: end.getTime(), start: start.getTime()}
}

const  getDateObjectToday = async () => {
    const FUNCTION = "getDateObjectToday"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")
    let myDate = new Date(await this.getTimestampToday())
    return myDate
}

const  getTimestampToday = async () => {
    const FUNCTION = "getTimestampToday"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")

    const sqlTS = "select TIMESTAMP , OVERWRITE  from TIME"
    const time = await myDB.get(sqlTS)
    log.log("time: " + time , MODUL, FUNCTION, LEVEL, "Return","DEBUG")
    let overwrite = "false"
    let timestamp = new Date().getTime()
    if(time.length > 0){
        overwrite = time[0].OVERWRITE
        timestamp = time[0].TIMESTAMP
    }
    if(overwrite == "true"){
        timestamp = Number(timestamp)
    }
    log.log("timestamp: " + timestamp  , MODUL, FUNCTION, LEVEL, "Return","DEBUG")
    return timestamp
}

const  setTimestampToday = async (timestamp ,  overwrite) => {
    const FUNCTION = "setTimestampToday"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")
    const sqlDel = "delete  from TIME"
    await myDB.run(sqlDel)

    const sqlInsert = "INSERT INTO TIME (OVERWRITE, TIMESTAMP) "
        + " VALUES "
        + " ('" + overwrite + "' , '" + timestamp  + "')"
    const ret = await myDB.run(sqlInsert)
    log.log("SQL: " + sqlInsert , MODUL, FUNCTION, LEVEL, "SQL","DEBUG")
    return sqlInsert
}

const  resetTimestampToday = async () => {
    const sqlDel = "delete  from TIME"
    await myDB.run(sqlDel)
}

/*
    const betragSQL = "select SUM(BETRAG) as betrag from HISTORY where  betrag != 0  AND betrag != '-'  AND HISTORY.AUFTRAGSNR = '" + history[i].ID_History + "'"
    const betrag = await myDB.get(betragSQL)

    const sqlDel2 = "delete  from JOURNALHISTORYMAP where ID_Trade = '" + journalId + "'"
    await myDB.run(sqlDel1)


    const sqlDailyCount = "INSERT INTO JOURNALHISTORYMAP (ID_History, ID_Trade) "
        + " VALUES "
        + " ('" + historyMAP[i].histID + "' , '" + JournalID + "')"
    const ret = await myDB.run(sqlDailyCount)

*/
exports.setTimestampToday = setTimestampToday;
exports.getTimestampToday = getTimestampToday;
exports.resetTimestampToday = resetTimestampToday;
exports.getYearTimes = getYearTimes;
exports.getMonthTimes = getMonthTimes;
exports.getDayTimes = getDayTimes;
exports.getWeekTimes = getWeekTimes;
exports.getYesterdayTimes = getYesterdayTimes; 
exports.getDateObjectToday = getDateObjectToday