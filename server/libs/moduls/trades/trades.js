const myDB = require('../../database/database');
const cfg = require('./../../../config/config.json');
const fs = require('fs')
const myTime = require('../../moduls/time/myTime');

const log = require("../../moduls/logging/log")
const MODUL = "trades.js"
const LEVEL = 99

// glaub das ist etwas ineffizent
const checkPictures = async (auftragsnr , id) => {
    let ret = false
    let picpath = "./PICTURE"
    if (cfg.customPicture) {
        picpath = cfg.customPictureFolder
    }
    if(process.env.DOCKER == 'true'){
        console.log("Change for Docker picture path")
        picpath = "/picture"
      }
    const aPicsinFolder = await fs.readdirSync(picpath)
    for (let i = 0; i < aPicsinFolder.length; i++) {
       
        let searchString = aPicsinFolder[i].toUpperCase()
        if (searchString.includes(id) || searchString.includes(auftragsnr) ) {

            ret = true
            
        }
    }
    return ret
}


const getJournalOnlyData = async (filter, startTime , endTime , settings, aPositions ) => {

    sql1 = "select * from journal as j  WHERE  NOT EXISTS (select * from JOURNALHISTORYMAP as sjh where j.id = sjh.ID_Trade  ) and j.ID BETWEEN " + startTime + "  and " + endTime +  "  "
  
    let position = await myDB.get(sql1)
    for (let i = 0; i < position.length; i++) {
        let temp = {

            auftragsnr: position[i].AUFTRAGSNR,
            betrag:  position[i].BETRAG,
            typ:  position[i].TYP,
            produkt: position[i].SYMBOL,
            verlinkt: false,
            datum: position[i].DATUM,
            myid: position[i].ID,
            map: null,
            pic:  await checkPictures(position[i].AUFTRAGSNR , position[i].ID)
        }
        aPositions.push(temp)
    }

    sql2 = "select * from journal as j inner join JOURNALHISTORYMAP as jh on j.id = jh.ID_Trade  WHERE  jh.ID_History = '' and j.ID BETWEEN " + startTime + "  and " + endTime +  "  "
    position = await myDB.get(sql2)
    for (let i = 0; i < position.length; i++) {
        let temp = {
            auftragsnr: position[i].AUFTRAGSNR,
            betrag:  position[i].BETRAG,
            typ:  position[i].TYP,
            produkt: position[i].SYMBOL,
            verlinkt: false,
            datum: position[i].DATUM,
            myid: position[i].ID,
            map: null,
            pic:  await checkPictures(position[i].AUFTRAGSNR , position[i].ID)
        }
        aPositions.push(temp)
    }
    sql3 = "select * from journal as j inner join JOURNALHISTORYMAP as jh on j.id = jh.ID_Trade  WHERE NOT EXISTS (select * from HISTORY as h where jh.ID_History = h.AUFTRAGSNR  ) and j.ID BETWEEN " + startTime + "  and " + endTime +  "  "
    position = await myDB.get(sql3)
    for (let i = 0; i < position.length; i++) {
        let temp = {
            auftragsnr: position[i].AUFTRAGSNR,
            betrag:  position[i].BETRAG,
            typ:  position[i].TYP,
            produkt: position[i].SYMBOL,
            verlinkt: false,
            datum: position[i].DATUM,
            myid: position[i].ID,
            map: null,
            pic:  await checkPictures(position[i].AUFTRAGSNR , position[i].ID)
        }
        aPositions.push(temp)
    }

    return aPositions

}



const getOpenOnlyData = async (filter, startTime , endTime , settings, aPositions ) => 
{
    let productSQL = " 1=1 "
    if(settings.product != "all"){
        productSQL = productSQL + " and produkt = '" + settings.product + "'"
    }
    
    const sqlPosition = "select DISTINCT datum , auftragsnr , zugauftragsnr , tradenr ,  betrag , produkt, typ from HISTORY as h  where " + productSQL + " and " 
    + " ( TYP = 'Kauf-Auftrag (Markt)' "
    + " OR TYP = 'SE Kauf (ausgeführt)' "
    + " )"
    + " and h.timestamp BETWEEN " + startTime + "  and " + endTime +  "  and h.typ != 'Haltekosten'  and h.typ != 'GSLO'   "
 
    let position = await myDB.get(sqlPosition)
    let total = 0
   
    for(let i=0; i<position.length; i++){

        // check for dublicates
        if(noDublicate(position[i].AUFTRAGSNR , aPositions)){
            const sqlCheckMap = "select DISTINCT ID_TRADE as MYID  from  JOURNALHISTORYMAP as m where '" + position[i].AUFTRAGSNR + "' = m.ID_History or  '" + position[i].TRADENR + "' = m.ID_History or '" + position[i].ZUGAUFTRAGSNR + "' = m.ID_History "
            let maplist = await myDB.get(sqlCheckMap)
            let temp = {
                auftragsnr: position[i].AUFTRAGSNR,
                betrag:  position[i].BETRAG,
                typ:  position[i].TYP,
                produkt: position[i].PRODUKT,
                verlinkt: false,
                datum: position[i].DATUM,
                myid:  position[i].MYID ,
                map: maplist,
                pic:  await checkPictures(position[i].AUFTRAGSNR , position[i].MYID)
            }
           
            if (maplist.length > 0){
                temp.verlinkt = true
                temp.myid = maplist[0].MYID   
            }
            if(filter == "empty" && maplist.length == 0){
                aPositions.push(temp)   
                total = total + Number(position[i].BETRAG)
            } 
            if (filter == "linked" && maplist.length > 0){
                aPositions.push(temp)   
                total = total + Number(position[i].BETRAG)
            }
            if (filter == undefined || filter == "all"){
                aPositions.push(temp) 
                total = total + Number(position[i].BETRAG)  
            }  
    
        }else{
            console.log("Dublicate - " + position[i].AUFTRAGSNR)
        }
       
    } 
    return aPositions
}

const getTrades = async (filter, startTime , endTime , settings ) => {
    const FUNCTION = "getTrades"
    log.log("Start" , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")
    if(startTime == undefined || endTime == undefined){
        let time = await myTime.getDayTimes()
        startTime = time.start
        endTime = time.end
    }else{
        var s = new Date(startTime);
        s.setHours(0,0,0,0);
        var e = new Date(endTime);
        e.setHours(24,0,0,0);        
        startTime = s.getTime()
        endTime = e.getTime()
    }
    let productSQL = " 1=1 "
    if(settings == undefined){
        settings = {product: "all"}
    }
    if(settings.product != "all"){
        productSQL = productSQL + " and produkt = '" + settings.product + "'"
    }
    
    const sqlPosition = "select DISTINCT datum , auftragsnr , zugauftragsnr , tradenr ,  betrag , produkt, typ from HISTORY as h  where " + productSQL + " and betrag != '-' and h.betrag != 0 and h.timestamp BETWEEN " + startTime + "  and " + endTime +  "  and h.typ != 'Haltekosten'  and h.typ != 'GSLO'   "
    log.log("SQL: " + sqlPosition , MODUL, FUNCTION, LEVEL, "SQL","DEBUG")
    let position = await myDB.get(sqlPosition)
    let aPositions = []

    let total = 0
    let winnerCount = 0
    let loserCount = 0
    let winnerSum = 0
    let loserSum = 0
               

    let crv = 0;
    let avg = 0
    let winrate = 0;
    let avgwinner = 0;
    let avgloser = 0;
  
    let maxwinner = 0;
    let maxloser = 0;

    
    let aProducts = [] 
    for(let i=0; i<position.length; i++){
        const sqlCheckMap = "select DISTINCT ID_TRADE as MYID  from  JOURNALHISTORYMAP as m where '" + position[i].AUFTRAGSNR + "' = m.ID_History or  '" + position[i].TRADENR + "' = m.ID_History or '" + position[i].ZUGAUFTRAGSNR + "' = m.ID_History "
        let maplist = await myDB.get(sqlCheckMap)
        let temp = {
            auftragsnr: position[i].AUFTRAGSNR,
            betrag:  position[i].BETRAG,
            typ:  position[i].TYP,
            produkt: position[i].PRODUKT,
            verlinkt: false,
            datum: position[i].DATUM,
            myid:  position[i].MYID ,
            map: maplist,
            pic:  await checkPictures(position[i].AUFTRAGSNR , position[i].MYID)
        }
       
        if (maplist.length > 0){
            temp.verlinkt = true
            temp.myid = maplist[0].MYID   
        }
        if(filter == "empty" && maplist.length == 0){
            aPositions.push(temp)   
            total = total + Number(position[i].BETRAG)
        } 
        if (filter == "linked" && maplist.length > 0){
            aPositions.push(temp)   
            total = total + Number(position[i].BETRAG)
        }
        if (filter == undefined || filter == "all"){
            aPositions.push(temp) 
            total = total + Number(position[i].BETRAG)  
        }  

        maxwinner = getMaxMin(maxwinner , Number(position[i].BETRAG)   , false)
        maxloser = getMaxMin(maxloser , Number(position[i].BETRAG)   , true)

        let retAVGLose = getAVG( position[i].BETRAG , loserSum , loserCount  , true)
        loserCount = retAVGLose.count
        loserSum = retAVGLose.sum
        avgloser = retAVGLose.avg
        
        let retAVGWin = getAVG( position[i].BETRAG , winnerSum , winnerCount , false)
        winnerCount = retAVGWin.count
        winnerSum = retAVGWin.sum
        avgwinner = retAVGWin.avg

        avg =  ( retAVGWin.sum + retAVGLose.sum   ) /  ( retAVGWin.count + retAVGLose.count)
        if(isNaN(avg) == false ) { 
            avg = avg.toFixed(2) 
        }

        winrate = retAVGWin.count / ( retAVGWin.count + retAVGLose.count) * 100
    } 
    /*
        Add Data which is only in Journal
    */
    aPositions = await getJournalOnlyData(filter, startTime , endTime , settings, aPositions)
    aPositions = await getOpenOnlyData(filter, startTime , endTime , settings, aPositions)
    aProducts = getSingleProducts(position)
    let ret = {
        tradeItems: aPositions,
        products: aProducts,
        total: total.toFixed(2),
         avg: avg,
         winrate: winrate.toFixed(2),
         avgwinner: avgwinner.toFixed(2),
         avgloser: avgloser.toFixed(2),
         maxwinner: maxwinner.toFixed(2),
         maxloser : maxloser.toFixed(2)
        }
    
    return ret
}
exports.getTrades = getTrades;
 
function noDublicate(position, aPostions){
    let ret = true
    for(let i=0; i<aPostions.length;i++){
        if(aPostions[i].auftragsnr == position){
            ret = false
            break
        }
    }
return ret
}

function getSingleProducts(position){
    let aProducts = ['all']
    for(let i=0; i<position.length; i++){
        if(!arrayContains(aProducts ,position[i].PRODUKT )){
            aProducts.push(position[i].PRODUKT)
        }
    }
    return aProducts
}

function arrayContains(array , value){
    var found = false;
    for(var i = 0; i < array.length; i++) {
        if (array[i] == value) {
            found = true;
            break;
        }
    }
    return found
}

function getAVG(betrag , sum , count , loser){
    let ret = {
        sum: sum,
        count: count,
        avg: sum/count
    }
    if(loser){
        if(betrag < 0){
            ret.sum = sum + betrag
            ret.count = count + 1
            ret.avg = ret.sum /  ret.count
        }
    }else{
        if(betrag > 0){
            ret.sum = sum + betrag
            ret.count = count + 1
            ret.avg = ret.sum /  ret.count
        }
    }
    return ret
}

function getMaxMin(last , betrag , negativNumber){
    let ret = last
    if(negativNumber){
        if(last > betrag){
            ret = betrag
        }
    }else{
        if(last < betrag){
            ret = betrag
        }
    }
    return ret
}