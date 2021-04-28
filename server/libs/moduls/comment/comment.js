const myDB = require('../../database/database');

const  getCommentByID = async (id ) => {
    let aIDs= []
    let aRet = []

    let journalID = id
    if(journalID != undefined)
    {
    // Check if this is a Journal or an History ID
    if(journalID.includes("-")){
        // If History -> find journalID
        sql2 = "select ID_TRADE as journalid from  JOURNALHISTORYMAP WHERE ID_HISTORY = '" + id + "' LIMIT 1 "
        let ret = await myDB.get(sql2)
        journalID = ret[0].journalid
    }
    
    aIDs.push(journalID)
    // Find all History ID's of the journal id
     // If History -> find journalID
     sql3 = "select ID_HISTORY as historyid from  JOURNALHISTORYMAP WHERE ID_TRADE = '" + journalID + "' "
     let HistoryIDs = await myDB.get(sql3)
    
     
    for(let n=0; n<HistoryIDs.length; n++){
        aIDs.push(HistoryIDs[n].historyid)
    }
    
 
     for(let i=0; i<aIDs.length; i++){
        let sql1 = "select * from comment WHERE  journalid = '" + aIDs[i] + "' "
        let comment = await myDB.get(sql1)
        for (let i=0; i<comment.length;i++){
            let dateObject = new Date(comment[i].timestamp)
            let humanDateFormat = dateObject.toLocaleString()
            comment[i].timestamp = humanDateFormat
            aRet.push(comment[i])
        }
     }
    }else{
        aRet.push({comment:"No Comment Found"})
        console.log("Warning: No ID to search Comment")
    }

    return aRet
}

const writeComment = async (myJ ) => {
let timestamp = new Date().getTime()
const sqlComment = "INSERT INTO comment ( "
    + " journalid , comment, timestamp "
    + " ) "
        + " VALUES ("
        + "'" + myJ.journalid + "','" + myJ.comment + "','" + timestamp + "'  "
        + " ) "
    await myDB.run(sqlComment)
}

exports.writeComment = writeComment;
 
exports.getCommentByID = getCommentByID;
