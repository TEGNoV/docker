const myDB = require('../../database/database');
const getRiskBasedResult = async (filter, startTime , endTime ) => {
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

    const sqlPosition = "select DISTINCT auftragsnr , zugauftragsnr , tradenr ,  betrag , produkt, typ from HISTORY as h  where betrag != '-' and h.betrag != 0 and h.timestamp BETWEEN " + startTime + "  and " + endTime +  "  and h.typ != 'Haltekosten'  and h.typ != 'GSLO'   "
    let position = await myDB.get(sqlPosition)
    let aPositions = []

    for(let i=0; i<position.length; i++){
        const sqlCheckMap = "select DISTINCT ID_TRADE from  JOURNALHISTORYMAP as m where '" + position[i].AUFTRAGSNR + "' = m.ID_History or  '" + position[i].TRADENR + "' = m.ID_History or '" + position[i].ZUGAUFTRAGSNR + "' = m.ID_History "
        let maplist = await myDB.get(sqlCheckMap)
        let temp = {
            auftragsnr: position[i].AUFTRAGSNR,
            betrag:  position[i].BETRAG,
            typ:  position[i].TYP,
            produkt: position[i].PRODUKT,
            map: maplist
        }
        if(filter == "empty" && maplist.length == 0){
            aPositions.push(temp)   
        } 
        if (filter == "linked" && maplist.length > 0){
            aPositions.push(temp)   
        }
        if (filter == undefined || filter == "all"){
            aPositions.push(temp)   
        }  
    }
    //console.log(aPositions)
    return {risk:1}
}
exports.getRiskBasedResult = getRiskBasedResult;
 