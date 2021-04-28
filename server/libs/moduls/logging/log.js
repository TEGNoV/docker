let logData = [{entry:"asdasdas"}]

const log = async (msg , module, level) => {
    let myLog = "Level: " + level + "\t Modul: " + module + "\t msg: " + msg
    console.log( myLog)
    logData.push({entry:myLog})
}

const getLog = async (module, level) => {
    return {log:logData }
}

exports.log = log;
exports.getLog = getLog;