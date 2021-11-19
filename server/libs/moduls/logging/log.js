let logData = [{entry:"asdasdas"}]

const log = async (msg , module, myFunction, level, typ , levelTyp) => {
    let myLog = "Level: " + level + "\t Modul: " + module + "\t Function: " + myFunction + "\t msg: " + msg
    
    // LevelTyp = Warn Debug Info Error
    if(typ != undefined && level < 100)
    {
        console.log(myLog)
    }
    
    
    logData.push({entry:myLog})
}

const getLog = async (module, level) => {
    return {log:logData }
}

exports.log = log;
exports.getLog = getLog;