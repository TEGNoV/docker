const Database = require('sqlite-async')
const cfg = require('./../../config/config.json');

/* ---------------------------------------- 
Public functions
---------------------------------------- */

const importCMCHistory = async (myArr) => {

    await dbwriteHistory(myArr)
}

const importCMCPosition = async (myArr) => {
    await dbwritePosition(myArr)
}

const init = async () => {
    await createPosition()
    await createJournalHistoryMap()
    await createHistory()
    await createJournal()
    await createLabels()
}

const get = async (sql) => {
    let result = null
    if (this.DB == null) {
        await dbOpen()
    }
    try {
        result = await DB.all(sql)
    } catch (error) {
        console.log("Error in get function of Database.js")
        throw Error(error);
    }
    if (this.DB != null) {
        await dbClose()
    }
    return result
}
const run = async (sql) => {
    let result = null
    if (this.DB == null) {
        await dbOpen()
    }
    try {
        result = await DB.run(sql)
    } catch (error) {
        console.log("Error in run function of Database.js")
        console.log(error)
        console.log(sql)
        throw Error(error);
    }
    if (this.DB != null) {
        await dbClose()
    }
    return result
}

/* ---------------------------------------- 
Private functions
---------------------------------------- */
async function dbOpen() {
    try {
        let path = "./database/journal.db"
        if(cfg.customDatabase){
            path = cfg.customDatabaseFolder
        }
        //path = cfg.customDatabaseFolder
        //path = "/db/journal.db"
        if(process.env.DOCKER == 'true'){
            console.log("Change for Docker DB Patch")
            path = "/db/journal.db"
            console.log(path)
        }
       
        this.DB = await Database.open(path);
    } catch (error) {
        console.log(error)
        throw Error('can not open sqlite database');
    }
}

async function dbClose() {
    try {
        // await this.DB.close
    } catch (error) {
        throw Error('can not close sqlite database');
    }
}



async function createLabels() {
    let result = null
    if (this.DB == null) {
        await dbOpen()
    }
    try {
        await DB.run(`
            CREATE TABLE IF NOT EXISTS LABELS 
            (
                TRADE Text,
                LABEL Text
            )
        `);
    } catch (error) {
        throw Error('Could not create table')
    }
    await dbClose()
    return result
}
async function createJournal() {
    let result = null
    if (this.DB == null) {
        await dbOpen()
    }
    try {
        await DB.run(`
            CREATE TABLE IF NOT EXISTS JOURNAL 
            (
                ID Text,
                PERIOD Text,
                STRATEGY Text,
                SYMBOL Text,
                BUYEXECUTIONRATING INTEGER,
                SELLEXECUTIONRATING INTEGER, 
                STRATEGYJSON Text,
                MYENTRY Text,
                MYEXIT Text
            )
        `);
    } catch (error) {
        throw Error('Could not create table')
    }
    await dbClose()
    return result
}

async function createPosition() {
    let result = null
    if (this.DB == null) {
        await dbOpen()
    }
    try {
        await DB.run(`
            CREATE TABLE IF NOT EXISTS POSITION 
            (
                POSITION Text,
                KV Text,
                ANZAHL Text,
                BETRAG Text,
                KURS Text,
                WECHSELKURS Text, 
                MARGIN Text,
                GESAMTPERF Text,
                GESAMTPERFPKT Text,
                GESAMTGV Text,
                SL Text,
                TP Text,
                KAUF Text
            )
        `);
    } catch (error) {
        throw Error('Could not create table')
    }
    await dbClose()
    return result
}

async function createJournalHistoryMap() {
    let result = null
    if (this.DB == null) {
        await dbOpen()
    }
    try {
        await DB.run(`
            CREATE TABLE IF NOT EXISTS JOURNALHISTORYMAP 
            (
                ID_History Text,
                ID_Trade Text
            )
        `);
    } catch (error) {
        throw Error('Could not create table')
    }
    await dbClose()
    return result
}

async function createHistory() {
    let result = null
    if (this.DB == null) {
        await dbOpen()
    }
    try {
        await DB.run(`
        CREATE TABLE IF NOT EXISTS HISTORY (
            DATUM	date,
            TYP	TEXT,
            AUFTRAGSNR	TEXT,
            TRADENR	TEXT,
            ZUGAUFTRAGSNR	TEXT,
            PRODUKT	TEXT,
            ANZAHLBETRAG	TEXT,
            KURS	TEXT,
            PREISGRENZE	TEXT,
            STOPLOSS	TEXT,
            TAKEPROFIT	TEXT,
            MARGIN	TEXT,
            WECHSELKURS	NUMERIC,
            WERT	NUMERIC,
            BETRAG	NUMERIC,
            KONTOSTAND	NUMERIC,
            BETRAGEXKLUSIVEDERGEBUEHR	TEXT,
            GEBUEHR	TEXT,
            HALTEKOSTENSATZHALTEKOSTEN	TEXT,
            HALTEKOSTENAUSGLEICH	TEXT,
            HALTEKOSTENGESAMT	TEXT,
            PRAEMIE	TEXT,
            RUECKZAHLUNG	TEXT,
            ZIEL	TEXT,
            GEWINN	TEXT,
            AUSZAHLEN	TEXT,
            GLEICHSTANDSAUSZAHLUNG	TEXT,
            OFFEN	TEXT,
            LAUFZEIT	TEXT,
            ABSCHLUSS	TEXT,
            ENDPREIS	TEXT,
            ERGEBNIS	TEXT,
            AUSZAHLUNG	TEXT,
            TYP2	TEXT,
            LAUFZEIT2	TEXT,
            STRIKEKURS	TEXT,
            ABSCHLUSS2	TEXT,
            ENDPREIS2	TEXT,
            GEWINN2	TEXT,
            VERLUST	TEXT,
            ID	INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            TIMESTAMP	INTEGER
        )`);
    } catch (error) {
        throw Error(error)
    }
    await dbClose()
    return result
}

async function formatValues(arr) {
    // datum
    arr[0] = Date.parse(arr[0]);
    return arr
}

function myNum(value) {
    if(value != undefined){
        let temp = value.toString()
        let first = temp.split('.').join('')
        let second = first.split(',').join('.')
        return second
    }else{
        return value
    }

    
}

function myTimestamp(value) {
    let first = value.split('Dez').join('Dec')
    first = first.split('Mai').join('May')
    first = first.split('Mär').join('Mar')
    first = first.split('Okt').join('Oct')
    console.log(first)
    let result = new Date(first).getTime()
    return result
}

async function checkExists(arr) {
    let result = null
    if (this.DB == null) {
        await this.dbOpen()
    }
    let sql = 'SELECT COUNT(*) as num FROM HISTORY WHERE DATUM = "' + arr[0] + '" AND   TYP = "' + arr[1] + '" AND  AUFTRAGSNR = "' + arr[2] + '" AND  TRADENR = "' + arr[3] + '" AND ZUGAUFTRAGSNR = "' + arr[4] + '" AND PRODUKT = "' + arr[5] + '"  '
    console.log(arr[2] + " allready exists")
    try {
        result = await this.DB.all(sql)
    } catch (error) {
        throw Error('checkExists: can not access sqlite database');
    }
    if (this.DB != null) {
        await dbClose()
    }
    let ret = false
    let checkNr = parseInt(result[0]['num'])
    if (checkNr < 1) {
        ret = true
    }
    return ret
}

async function dbwriteHistory(myArr) {
    let result = null
    if (this.DB == null) {
        await dbOpen()
    }
    console.log("--------------------------------------")
    console.log("Start dbwriteHistory")
    console.log("--------------------------------------")
    for (let i = 1; i < myArr.length; i++) {
        let arr = await formatValues(myArr)
        let isNewLine = await checkExists(arr[i])
        if (isNewLine) {
            let sql =
                ' INSERT INTO HISTORY '
                + ' (       DATUM,	            TYP	,	            AUFTRAGSNR	,	    TRADENR	,	        ZUGAUFTRAGSNR	,	PRODUKT	,	            ANZAHLBETRAG	,	        KURS	,	        PREISGRENZE	,	    STOPLOSS	,	        TAKEPROFIT	,	        MARGIN	,	        WECHSELKURS	,	        WERT	,	        BETRAG	,	                        KONTOSTAND	,	BETRAGEXKLUSIVEDERGEBUEHR	,GEBUEHR ,	HALTEKOSTENSATZHALTEKOSTEN	,	HALTEKOSTENAUSGLEICH,	HALTEKOSTENGESAMT	,PRAEMIE,	        RUECKZAHLUNG	,	        ZIEL	,	        GEWINN	,	        AUSZAHLEN	,	GLEICHSTANDSAUSZAHLUNG	,	OFFEN	,	            LAUFZEIT	,	        ABSCHLUSS	,	ENDPREIS	,	            ERGEBNIS	,	AUSZAHLUNG	,	            TYP2	,	        LAUFZEIT2	,	    STRIKEKURS	,	    ABSCHLUSS2	,	        ENDPREIS2	,	        GEWINN2	,	                    VERLUST , TIMESTAMP) '
                + ' VALUES '
                + ' ("' + arr[i][0] + '","' + arr[i][1] + '" ,"' + arr[i][2] + '" ,"' + arr[i][3] + '" ,"' + arr[i][4] + '" ,"' + arr[i][5] + '" ,"' + arr[i][6] + '" ,"' + myNum(arr[i][7]) + '" ,"' + arr[i][8] + '" ,"' + arr[i][9] + '" ,"' + arr[i][10] + '" ,"' + arr[i][11] + '" ,"' + arr[i][12] + '" ,"' + arr[i][13] + '" ,"' + myNum(arr[i][14]) + '" ,"' + myNum(arr[i][15]) + '" ,"' + arr[i][16] + '" ,"' + arr[i][17] + '" ,"' + arr[i][18] + '" ,"' + arr[i][19] + '" ,"' + arr[i][20] + '" ,"' + arr[i][21] + '" ,"' + arr[i][22] + '" ,"' + arr[i][23] + '" ,"' + arr[i][24] + '" ,"' + arr[i][25] + '" ,"' + arr[i][26] + '" ,"' + arr[i][27] + '" ,"' + arr[i][28] + '" ,"' + arr[i][29] + '" ,"' + arr[i][30] + '"  ,"' + arr[i][31] + '" ,"' + arr[i][32] + '" ,"' + arr[i][33] + '" ,"' + arr[i][34] + '" ,"' + arr[i][35] + '" ,"' + arr[i][36] + '" ,"' + arr[i][37] + '" ,"' + arr[i][38] + '" ,"' + arr[i][39] + '" , "' + myTimestamp(arr[i][0]) + '") '
            try {
                // zum arbeitena usgeschaltet
                console.log("working on: " + i + " out of: " + myArr.length)
                let ret = await this.DB.run(sql)

            } catch (error) {
                throw Error('dbwriteHistory: can not access sqlite database');
            }
        } else {
            //console.log("Dateisatz bereits vorhanden")
        }
    }
    if (this.DB != null) {
        await dbClose()
    }

    return result
}

function removeStringparts(value) {
    value = value.split('(G) ').join('')
    return value
}

function formatPositionNumbers(value) {
    return myNum(
        removeStringparts(value)
    )
}

function checkforCombinedEntry(value) {
    if (value.search('-') == 2) {
        return false
    }
    else { return true }
}

async function dbwritePosition(myArr) {
    let sqlDelete = 'delete from POSITION'
    try {
        console.log(sqlDelete)
        let ret = await this.DB.run(sqlDelete)

    } catch (error) {
        throw Error('dbwritePosition: Delete -> can not access sqlite database');
    }
    var lastSymbol = ""
    for (let i = 1; i < myArr.length; i++) {
        if (checkforCombinedEntry(myArr[i][0])) {
                console.log("double one")
                lastSymbol =myArr[i][0]
        }
        else {
            let sqlInsert =
                ' INSERT INTO POSITION '
                + ' ( POSITION , KV , ANZAHL , BETRAG , KURS , WECHSELKURS , MARGIN , GESAMTPERF , GESAMTPERFPKT , GESAMTGV , SL , TP , KAUF , SYMBOL)'
                + ' VALUES '
                + ' ("' + myArr[i][0] + '" , "' + myArr[i][1] + '" , "' + formatPositionNumbers(myArr[i][2]) + '" , "' + formatPositionNumbers(myArr[i][3]) + '" , "' + formatPositionNumbers(myArr[i][4]) + '" , "' + formatPositionNumbers(myArr[i][5]) + '" , "' + formatPositionNumbers(myArr[i][6]) + '" , "' + formatPositionNumbers(myArr[i][7]) + '" , "' + formatPositionNumbers(myArr[i][8]) + '" , "' + formatPositionNumbers(myArr[i][9]) + '" , "' + formatPositionNumbers(myArr[i][10]) + '" , "' + formatPositionNumbers(myArr[i][11]) + '" , "' + formatPositionNumbers(myArr[i][12]) + '" , "' + lastSymbol +'" )'
            try {
                let ret = await this.DB.run(sqlInsert)
            } catch (error) {
                throw Error('dbwritePosition: Insert -> can not access sqlite database');
            }
        }
    }


}


async function getBalanceStatistic(arg) {
    let sql = "SELECT strftime('%Y-%m-%d', datetime(timestamp/1000, 'unixepoch' , 'localtime')) as myDate, printf('%.2f', avg(KONTOSTAND)) AS myBalance  FROM HISTORY  where kontostand != '-' GROUP BY myDate order by myDate DESC"
    let ret = this.dbGet(sql)
    return ret
}

async function getProductStatistic(arg) {
    console.log(arg)
    let startTimestamp = new Date(arg.end[0]).getTime()
    let endTimestamp = new Date(arg.end[1]).getTime()
    console.log(endTimestamp)
    let sql = ''
    if (arg.end == '') {
        sql = "SELECT PRODUKT,  printf('%.2f',SUM(BETRAG))  as BETRAG , count(*) as COUNTER , "
            + "sum(case when Betrag > 0 then 1 else 0 end) as WIN , "
            + "sum(case when Betrag < 0 then 1 else 0 end) as LOSS "
            + "FROM HISTORY "
            + "where betrag != 0 "
            + "and PRODUKT != '-' "
            + "and PRODUKT != 'Handelskonto' "
            + "and betrag != '-' GROUP BY PRODUKT order by betrag "
    } else {
        sql = "SELECT PRODUKT,  printf('%.2f',SUM(BETRAG))  as BETRAG , count(*) as COUNTER , "
            + " sum(case when Betrag > 0 then 1 else 0 end) as WIN , "
            + " sum(case when Betrag < 0 then 1 else 0 end) as LOSS "
            + " FROM HISTORY "
            + " where TIMESTAMP BETWEEN  " + startTimestamp + " and " + endTimestamp
            + " AND betrag != 0 "
            + " and PRODUKT != '-' "
            + " and PRODUKT != 'Handelskonto' "
            + " and betrag != '-' GROUP BY PRODUKT order by betrag "
    }
    let ret = await this.dbGet(sql)

    let myReturn = []
    for (var i in ret) {

        console.log(ret[i]['PRODUKT'])

        let winrate = Number(ret[i]['WIN']) / Number(ret[i]['COUNTER']) * 100
        winrate = Math.round(winrate * 10) / 10;
        let temp = {
            'BETRAG': ret[i]['BETRAG'],
            'COUNTER': ret[i]['COUNTER'],
            'WIN': ret[i]['WIN'],
            'LOSS': ret[i]['LOSS'],
            'PRODUKT': ret[i]['PRODUKT'],
            'WINRATE': winrate
        }
        myReturn.push(temp)
    }
    //console.log(ret)
    //console.log(myReturn)
    return myReturn
}




exports.get = get;
exports.run = run
exports.init = init
exports.importCMCHistory = importCMCHistory
exports.importCMCPosition = importCMCPosition
