const myDB = require('../../database/database');
const cfg = require('./../../../config/config.json');
const fs = require('fs')

const createInitalJournalEntry = async (myJ) => {
   
    if(myJ.verlinken == true){
     
        var timestamp = new Date();
        myJ.journalId = timestamp.getTime()
    }

    
    await createJournalEntry(myJ)
    const ret = await createHistoryJournalLink(myJ.historyMAP, myJ.journalId)
    return ret

}

const updateJournalEntry = async (myJ) => {
   

    await updateJournal(myJ)
    const ret = await createHistoryJournalLink(myJ.historyMAP, myJ.journalId)
    return ret
}


const getSingleJournal = async (id) => {
 
    const ret = {}
    const journalSQL = "select * from JOURNAL as JOURNAL "
        + "  WHERE JOURNAL.ID = '" + id + "'"
    let journalRet = await myDB.get(journalSQL)
    journalRet = journalRet[0]

    
    const historySQL = "select * from JOURNALHISTORYMAP as JOURNALHISTORYMAP "
        + " WHERE JOURNALHISTORYMAP.ID_Trade = '" + id + "'"
    const historyID = await myDB.get(historySQL)
    const history = historyID
    let totalSum = 0
    for (let i = 0; i < historyID.length; i++) {
        const betragSQL = "select SUM(BETRAG) as betrag from HISTORY where  betrag != 0  AND betrag != '-'  AND HISTORY.AUFTRAGSNR = '" + history[i].ID_History + "'"
        const betrag = await myDB.get(betragSQL)

        if (betrag[0].betrag != null) {
            history[i].betrag = betrag[0].betrag
            totalSum = totalSum + betrag[0].betrag
            history[i].historyData = []
            const historyDataSQL = "select * from HISTORY as HISTORY "
                + " WHERE HISTORY.AUFTRAGSNR = '" + history[i].ID_History + "'"
            const historyData = await myDB.get(historyDataSQL)
            history[i].historyData.push(historyData)
        }
    }

    journalRet.totalBetrag = totalSum
    
    ret.journalPictures = await getSingleJournalPictures(id)
    ret.journal = journalRet
    ret.history = history

    return ret
}


const getSingleJournalPictures = async (id) => {
    let aRet = []
    let picpath = "./PICTURE"
    if (cfg.customPicture) {
        picpath = cfg.customPictureFolder
    }
    const historySQL = "select * from JOURNALHISTORYMAP as JOURNALHISTORYMAP "
        + " WHERE JOURNALHISTORYMAP.ID_Trade = '" + id + "'"
    const historyIDs = await myDB.get(historySQL)
    const aPicsinFolder = await fs.readdirSync(picpath)
    for (let i = 0; i < aPicsinFolder.length; i++) {
        if (aPicsinFolder[i].includes(id)) {
            aRet.push(aPicsinFolder[i])
        }
        for (let n = 0; n < historyIDs.length; n++) {
            if (aPicsinFolder[i].includes(historyIDs[n].ID_History)) {
                aRet.push(aPicsinFolder[i])
                break
            }
        }
    }
    return aRet
}


const getSinglePictures = async (id) => {
    let aRet = []
    let picpath = "./PICTURE"
    if (cfg.customPicture) {
        picpath = cfg.customPictureFolder
    }
    const aPicsinFolder = await fs.readdirSync(picpath)
    for (let i = 0; i < aPicsinFolder.length; i++) {
        if (aPicsinFolder[i].includes(id)) {
            aRet.push(aPicsinFolder[i])
        }
    }
    let ret = {
        journalPictures: aRet
    }
    return ret
}


const deleteSingleJournal = async (myJ) => {

    const journalId = myJ.journalId
    const sqlDel1 = "delete  from JOURNAL where ID = '" + journalId + "'"
    const sqlDel2 = "delete  from JOURNALHISTORYMAP where ID_Trade = '" + journalId + "'"
    await myDB.run(sqlDel1)
    await myDB.run(sqlDel2)

}

const unlinkHistory = async (myJ) => {
    const journalId = myJ.journalId
    const historyId = myJ.historyId
    const sqlDel2 = "delete  from JOURNALHISTORYMAP where ID_Trade = '" + journalId + "' AND ID_History = '" + historyId + "' "
    await myDB.run(sqlDel2)

}

const getAllTrades = async (startTime, endTime) => {
    if (startTime == undefined) {

    }
    if (endTime == undefined) {

    }
    const sqlDailyCount = "select * from JOURNAL "
        + " INNER JOIN JOURNALHISTORYMAP "
        + " ON JOURNAL.ID = JOURNALHISTORYMAP.ID_Trade "
        + " INNER JOIN HISTORY  "
        + " ON JOURNALHISTORYMAP.ID_History = HISTORY.AUFTRAGSNR GROUP BY JOURNAL.ID"
    const result = await myDB.get(sqlDailyCount)
}

const getAllJournal = async (startTime, endTime) => {
    if(startTime == undefined || endTime == undefined){
        var s = new Date();
        s.setHours(0,0,0,0);
        var e = new Date();
        e.setHours(24,0,0,0);        
        startTime = s.getTime()
        endTime = e.getTime()
    }else{
        var s = new Date(startTime);
        s.setHours(0,0,0,0);
        var e = new Date(endTime);
        e.setHours(24,0,0,0);        
        startTime = s.getTime()
        endTime = e.getTime()
    }

    const journalSQL = "select * from JOURNAL WHERE ID BETWEEN " + startTime + "  and " + endTime +  "  "
    const result = await myDB.get(journalSQL)

    for (let i = 0; i < result.length; i++) {
        const ID_HistorySQL = "select ID_History from JOURNALHISTORYMAP WHERE ID_Trade =  '" + result[i].ID + "'  "
        const ID_History = await myDB.get(ID_HistorySQL)
        let totalSum = 0
        for (let i = 0; i < ID_History.length; i++) {
            const betragSQL = "select SUM(BETRAG) as betrag from HISTORY where  betrag != 0  AND betrag != '-'   AND ( HISTORY.AUFTRAGSNR = '" + ID_History[i].ID_History + "'    OR  HISTORY.TRADENR = '" + ID_History[i].ID_History + "' OR HISTORY.ZUGAUFTRAGSNR = '" + ID_History[i].ID_History + "' )"
            const betrag = await myDB.get(betragSQL) 
            totalSum = totalSum +  Number(betrag[0].betrag)
        }
    result[i].TOTALSUM = totalSum.toFixed(2)
    }
    return result
}


async function updateJournal(myJ) {
    const updateSQL = "UPDATE JOURNAL "
        + " SET PERIOD = '" + myJ.period + "', "
        + " BUSINESSPLAN = '" + myJ.businessplan + "' , "
        + " STRATEGY = '" + myJ.strategy + "' , SYMBOL = '" + myJ.symbol + "' , "
        + " RISKLEVEL = '" + myJ.risklevel + "' , RISKTOTAL = '" + myJ.risktotal + "' , " + " BEMERKUNG = '" + myJ.bemerkung + "' ,  "
        + " BUYEXECUTIONRATING = '" + getRatingNumber(myJ.buyexecution) + "', "
        + " MYENTRY = '" + myJ.myentry + "', "
        + " MYENTRYLINE = '" + myJ.myentryline + "', "
        + " MYEXIT = '" + myJ.myexit + "', "
        + " SELLEXECUTIONRATING = '" + getRatingNumber(myJ.sellexecution) + "' , "
        + " FREITEXT1 = '" + myJ.freitext1 + "' , FREITEXT2 = '" + myJ.freitext2 + "' , "  + " FREITEXT3 = '" + myJ.freitext3 + "' , FREITEXT4 = '" + myJ.freitext4 + "' , "
        + " FEHLER1 = '" + myJ.fehler1 + "' , FEHLER2 = '" + myJ.fehler2 + "' , "  + " FEHLER3 = '" + myJ.fehler3 + "' , FEHLER4 = '" + myJ.fehler4 + "' , "
        + " SELLFIB1 = '" + myJ.sellfib1 + "' , SELLFIB2 = '" + myJ.sellfib2 + "' , "  + " SELLFIB3 = '" + myJ.sellfib3 + "' , SELLFIB4 = '" + myJ.sellfib4 + "' , "
        + " SELLFIB1RESULT = '" + myJ.sellfib1Result + "' , SELLFIB2RESULT = '" + myJ.sellfib2Result + "' , "  + " SELLFIB3RESULT = '" + myJ.sellfib3Result + "' , SELLFIB4RESULT = '" + myJ.sellfib4Result + "' , "
        + " BUYFIB1 = '" + myJ.buyfib1 + "' , BUYFIB2 = '" + myJ.buyfib2 + "' , "  + " BUYFIB3 = '" + myJ.buyfib3 + "' , BUYFIB4 = '" + myJ.buyfib4 + "' , "
        + " riskplan = '" + myJ.riskplan + "' , risk = '" + myJ.risk + "' , "  + " fireandforgeteinstiegtyp = '" + myJ.fireandforgeteinstiegtyp + "' , fireandforgeteinstieg = '" + myJ.fireandforgeteinstieg + "' , "
        + " fireandforgetstoploss = '" + myJ.fireandforgetstoploss + "' , fireandforgettp1reached = '" + myJ.fireandforgettp1reached + "' , "  + " fireandforgettp1level = '" + myJ.fireandforgettp1level + "' , fireandforgettp2reached = '" + myJ.fireandforgettp2reached + "' , "
        + " fireandforgettp2level = '" + myJ.fireandforgettp2level + "' , fireandforgettp3reached = '" + myJ.fireandforgettp3reached + "' , "  + " fireandforgettp3level = '" + myJ.fireandforgettp3level + "' , fireandforgettp4reached = '" + myJ.fireandforgettp4reached + "' , "
        + " fireandforgettp4level = '" + myJ.fireandforgettp4level + "' , fireandforgettp1ordernr = '" + myJ.fireandforgettp1ordernr + "' , "  + " fireandforgettp2ordernr = '" + myJ.fireandforgettp2ordernr + "' , fireandforgettp3ordernr = '" + myJ.fireandforgettp3ordernr + "' , "
        + " fireandforgettp4ordernr = '" + myJ.fireandforgettp4ordernr + "' , "
        + " STICKTOPLAN = '" + myJ.stickToPlan + "' , ISDOCUMENTED = '" + myJ.isDocumented + "' "
        + " WHERE id = '" + myJ.journalId + "'  "
    const ret = await myDB.run(updateSQL)
}

async function createJournalEntry(myJ) {

    const sqlDailyCount = "INSERT INTO JOURNAL (BUSINESSPLAN , ID, PERIOD, MYENTRY , MYENTRYLINE, MYEXIT, STRATEGY,SYMBOL,BUYEXECUTIONRATING,SELLEXECUTIONRATING,STRATEGYJSON, "
    + " RISKLEVEL , RISKTOTAL , BEMERKUNG , "
    + " FREITEXT1 , FREITEXT2 , FREITEXT3 , FREITEXT4 , "
    + " FEHLER1 , FEHLER2 , FEHLER3 , FEHLER4 , "
    + " SELLFIB1 , SELLFIB2 , SELLFIB3 , SELLFIB4 , "
    + " SELLFIB1RESULT , SELLFIB2RESULT , SELLFIB3RESULT , SELLFIB4RESULT , "
    + " BUYFIB1 , BUYFIB2 , BUYFIB3 , BUYFIB4 , "
    + " riskplan , risk , fireandforgeteinstiegtyp , fireandforgeteinstieg , "
    + " fireandforgetstoploss , fireandforgettp1reached , fireandforgettp1level , fireandforgettp2reached , "
    + " fireandforgettp2level , fireandforgettp3reached , fireandforgettp3level , fireandforgettp4reached , "
    + " fireandforgettp4level , fireandforgettp1ordernr , fireandforgettp2ordernr , fireandforgettp3ordernr , fireandforgettp4ordernr ,"
    + " STICKTOPLAN , ISDOCUMENTED "
    + " ) "
        + " VALUES "
        + " ('" + myJ.businessplan          + "' , '" + myJ.journalId + "' , '" + myJ.period + "', "
        + "'" + myJ.myentry                 + "',"
        + "'" + myJ.myentryline             + "',"
        + "'" + myJ.myexit                  + "',"
        + "'" + myJ.strategy                + "','" + myJ.symbol + "', '" + getRatingNumber(myJ.buyexecution) + "' ,'" + getRatingNumber(myJ.sellexecution) + "' , '' , "
        + "'" + myJ.risklevel               + "','" + myJ.risktotal + "','" + myJ.bemerkung + "'," 
        + "'" + myJ.freitext1               + "','" + myJ.freitext2 + "','" + myJ.freitext3 + "','" + myJ.freitext4 + "',"
        + "'" + myJ.fehler1                 + "','" + myJ.fehler2 + "','" + myJ.fehler3 + "','" + myJ.fehler4 + "',"
        + "'" + myJ.sellfib1                + "','" + myJ.sellfib2 + "','" + myJ.sellfib3 + "','" + myJ.sellfib4 + "',"
        + "'" + myJ.sellfib1Result          + "','" + myJ.sellfib2Result + "','" + myJ.sellfib3Result + "','" + myJ.sellfib4Result + "',"
        + "'" + myJ.buyfib1                 + "','" + myJ.buyfib2 + "','" + myJ.buyfib3 + "','" + myJ.buyfib4 + "' , "
        + "'" + myJ.riskplan                + "','" + myJ.risk + "','" + myJ.fireandforgeteinstiegtyp + "','" + myJ.fireandforgeteinstieg + "' , "
        + "'" + myJ.fireandforgetstoploss   + "','" + myJ.fireandforgettp1reached + "','" + myJ.fireandforgettp1level + "','" + myJ.fireandforgettp2reached + "' , "
        + "'" + myJ.fireandforgettp2level   + "','" + myJ.fireandforgettp3reached + "','" + myJ.fireandforgettp3level + "','" + myJ.fireandforgettp4reached + "' , "
        + "'" + myJ.fireandforgettp4level   + "','" + myJ.fireandforgettp1ordernr + "','" + myJ.fireandforgettp2ordernr + "','" + myJ.fireandforgettp3ordernr + "' , '" + myJ.fireandforgettp4ordernr + "' , "
        + "'" + myJ.stickToPlan             + "','" + myJ.isDocumented + "'  "
        + " ) "
    await myDB.run(sqlDailyCount)
 
}

function getRatingNumber(value) {
    if (isNaN(value)) {
        return 0
    } else {
        return Number(value)
    }
}


async function createHistoryJournalLink(historyMAP, JournalID) {
    for (let i = 0; i < historyMAP.length; i++) {
        if (await checkLinkExists(historyMAP[i].histID)) {

            const sqlDailyCount = "INSERT INTO JOURNALHISTORYMAP (ID_History, ID_Trade) "
                + " VALUES "
                + " ('" + historyMAP[i].histID + "' , '" + JournalID + "')"
            const ret = await myDB.run(sqlDailyCount)

        } else {
            console.log("history id bereits verlinkt vorhanden")
            throw ("history id bereits verlinkt vorhanden")

        }
    }
}

async function checkLinkExists(historyID) {
    const sqlDailyCount = "select count(*) as counter , ID_Trade from JOURNALHISTORYMAP where ID_History = '" + historyID + "' "
    const result = await myDB.get(sqlDailyCount)
    if (Number(result[0].counter) == 0) {
        return true
    } else {
        return false
    }
}

exports.createInitalJournalEntry = createInitalJournalEntry;
exports.getAllTrades = getAllTrades
exports.getAllJournal = getAllJournal
exports.getSingleJournal = getSingleJournal
exports.deleteSingleJournal = deleteSingleJournal
exports.unlinkHistory = unlinkHistory
exports.updateJournalEntry = updateJournalEntry
exports.getSingleJournalPictures = getSingleJournalPictures
exports.getSinglePictures = getSinglePictures