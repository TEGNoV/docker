const myDB = require('../../database/database');
const singleRiskPerTrade = 0.04
const maxDayRisk = 0.1

const yearT1 = 100
const yearT2 = 500

const monthT1 = 9
const monthT2 = 42

const weakT1 = 2
const weakT2 = 10

const dayT1 = 0.4
const dayT2 = 2

const startDate = '2021-03-01'

function extrapolate(limit, lineChartData) {
    for (let i = 0; i < limit; i++) {
        let count = i + 1
        let temp = {
            label: 'extrapolation-' + count,
            kontostand: lineChartData[lineChartData.length - 1].kontostand,
        }
        lineChartData.push(temp)
    }
    return lineChartData
}
function getTargetsDataPoints(percent, startbalance, lineChartData, name) {
    let lastValue = startbalance
    for (let i = 0; i < lineChartData.length; i++) {

        if (lineChartData[i].deposit == undefined) lineChartData[i].deposit = 0
        lastValue = (lastValue * (1 + percent / 100) + Number(lineChartData[i].deposit)).toFixed(0)
        lineChartData[i][name] = lastValue
    }

}


const setPositionIgnore = async (position , ignore) => {
    const updateSQL = "UPDATE POSITION "
    + " SET IGNORE = '" + ignore + "' "
    + " WHERE POSITION = '" + position + "'  "
    const ret = await myDB.run(updateSQL)   
}

const getAllowedRisk = async (kontostand , starttime, endtime , percent , openRisk) => {

    const sqlLineChartData = 'select BETRAG as betrag , BETRAG as label from HISTORY where  BETRAG != 0 AND BETRAG != "-"  and TYP != "Einzahlung"  and TIMESTAMP BETWEEN  ' + starttime + ' and ' + endtime
    let lineChartData = await myDB.get(sqlLineChartData)
    let current = 0

    for (let n = 0; n < lineChartData.length; n++) {
        current = current + Number(lineChartData[n].betrag)
    }
    current = current * -1
    let dayMaxRisk = Number(kontostand) * Number(percent)
    let dayWin = 0
    let dayLose = 0
    let dayOpen = openRisk * -1
    if(current < 0.0 ){
        dayWin = current * -1
        dayLose = 0.0
    }else{
        dayLose = current
        dayWin = 0.0
    }
    let dayAvailable = (Number(dayMaxRisk) +  Number(dayWin)) -  (Number(dayLose) + Number(dayOpen))
    let dayOverBudget = 0
    let currentAvailable = dayAvailable
    if(dayAvailable < 0.0){
        dayOverBudget = dayAvailable *-1
        dayAvailable = 0
    }

    let ret = {
        total: currentAvailable.toFixed(2),
        maxRisk: dayMaxRisk.toFixed(2),
        chartdata: [dayLose,dayAvailable,dayOpen,dayWin,dayOverBudget]
    }

    return ret

}

const getDayRisk = async () => {
    let getPositions = await this.getPositions() 
    let getPositionTotal = getPositions.position.total

    let options = {}
    let konto = await this.getKontostand(options)
    let dayStartKontostand = konto.kontostand
    let weekStartKontostand = konto.kontostandWeekstart
    let monthtartKontostand = konto.kontostandMonthstart

    var startDayly = new Date();
    startDayly.setHours(0, 0, 0, 0);
    var endDayly = new Date();
    endDayly.setHours(23, 59, 59, 999);
    let openRisk = Number(getPositionTotal.risk)

    let timestamps = getTimestamps()
    let ret = {
        // 'Red',    // Lost
        // 'Blue',   // Availible to lose  -  ( Win + Max Lose ) - ( Open Risk + Lost )
        // 'Yellow', // Open Risk
        // 'Green'   // Win
        // 'DeepRed // over budget
        
        chartDataDay: await getAllowedRisk(dayStartKontostand , timestamps.day.start, timestamps.day.end, 0.04 , openRisk),
        chartDataWeek: await getAllowedRisk(weekStartKontostand , timestamps.week.start, timestamps.week.end, 0.10 , openRisk),
        chartDataMonth:await getAllowedRisk(monthtartKontostand , timestamps.month.start, timestamps.month.end, 0.2 , openRisk),
        risk:{
            allowedLose:0,
            openRisk: 0,
            current: 0,
            availableRisk: 0
        }
    }
    return ret
}

const getTimestamps = () => {
var startYesterdayDayly = new Date();
startYesterdayDayly.setDate(startYesterdayDayly.getDate() - 1);
startYesterdayDayly.setHours(0, 0, 0, 0);
var endYesterdayDayly = new Date();
endYesterdayDayly.setDate(endYesterdayDayly.getDate() - 1);
endYesterdayDayly.setHours(23, 59, 59, 999);

var startDayly = new Date();
startDayly.setHours(0, 0, 0, 0);
var endDayly = new Date();
endDayly.setHours(23, 59, 59, 999);


var startWeek = new Date();
for (i = 0; i < 8; i++) {
    var n = startWeek.getDay()
    if (n == 1) {
        startWeek.setHours(0, 0, 0, 0);
    } else {
        startWeek.setDate(startWeek.getDate() - 1);
    }
}
var endWeek = new Date(startWeek.getTime())
endWeek.setDate(endWeek.getDate() + 5)



var date = new Date(), y = date.getFullYear(), m = date.getMonth();
var firstDay = new Date(y, m, 1);

var yearStart = "2021-01-01"
var startYear = new Date(yearStart);
    startYear.setHours(0, 0, 0, 0);

    ret = {
        day:{
            start: startDayly.getTime(),
            end: endDayly.getTime()
        },
        yesterday:{
            start: startYesterdayDayly.getTime(),
            end: endYesterdayDayly.getTime()
        },
        week:{
            start: startWeek.getTime(),
            end: endWeek.getTime()
        },
        month:{
            start: firstDay.getTime(),
            end: endDayly.getTime()
        },
        year:{
            start: startYear.getTime(),
            end: endDayly.getTime()
        },
    }
return ret
}

const getTargetCharts = async (options) => {
    let lineChartLimit = 5
    let periodSelect = "start of day"
    let targetPercent1 = 0
    let targetPercent2 = 0
    if (options != undefined) {
        if (options.lineChart != undefined) {
            if (Number(options.lineChart.limit) != 0 && Number(options.lineChart.limit) != NaN) {
                lineChartLimit = Number(options.lineChart.limit)
            }
            if (options.lineChart.period != undefined) {
                if (options.lineChart.period == "Days") {
                    periodSelect = "start of day"
                    targetPercent1 = dayT1
                    targetPercent2 = dayT2

                }
                if (options.lineChart.period == "Weeks") {
                    periodSelect = "weekday 1"
                    targetPercent1 = weakT1
                    targetPercent2 = weakT2
                }
                if (options.lineChart.period == "Months") {
                    periodSelect = "start of month"
                    targetPercent1 = monthT1
                    targetPercent2 = monthT2
                }
                if (options.lineChart.period == "Years") {
                    periodSelect = "start of year"
                    targetPercent1 = yearT1
                    targetPercent2 = yearT2
                }
            }
        }
    }

    var targetStartDate = new Date(startDate);
    targetStartDate.setHours(0, 0, 0, 0);

    const sqlLineChartData = 'select  MAX(TIMESTAMP) as ts , DATE(strftime("%Y-%m-%d ", datetime(TIMESTAMP/1000, "unixepoch")) , "' + periodSelect + '") AS label,  KONTOSTAND as kontostand from HISTORY where  KONTOSTAND != 0 AND KONTOSTAND != "-" AND betrag != "-" AND TIMESTAMP > ' + targetStartDate.getTime() + '  GROUP BY label order by label  DESC    '
    let lineChartData = await myDB.get(sqlLineChartData)

    const sqlDeposit = 'select SUM(BETRAG) as deposit,  MAX(TIMESTAMP) as ts , DATE(strftime("%Y-%m-%d ", datetime(TIMESTAMP/1000, "unixepoch")) , "' + periodSelect + '") AS label,  KONTOSTAND as kontostand from HISTORY where  BETRAG != 0 AND BETRAG != "-"  and TYP == "Einzahlung" GROUP BY label order by label  DESC limit ' + lineChartLimit + ' '
    let depositData = await myDB.get(sqlDeposit)


    lineChartData.reverse()
    depositData.reverse()


    let lastTimestamp = 0
    let lastDepositTimestamp = 0

    for (let i = 0; i < lineChartData.length; i++) {
        let deposit = 0
        if (lastTimestamp < Number(lineChartData[i].ts)) {
            lastTimestamp = Number(lineChartData[i].ts)
            if (i == 0) { lastDepositTimestamp = lastTimestamp }

            // check for new deposit
            for (let n = 0; n < depositData.length; n++) {
                if (lastDepositTimestamp < Number(depositData[n].ts) && Number(depositData[n].ts) < Number(lineChartData[i].ts)) {
                    lastDepositTimestamp = Number(depositData[n].ts)
                    deposit = Number(depositData[n].deposit)
                }
            }

        }
        lineChartData[i].deposit = deposit
    }

    //let startbalance = Number(lineChartData[0].kontostand)
    
    let konto = await this.getKontostand(options)
    let startbalance = konto.kontostand

    lineChartData = extrapolate(lineChartLimit, lineChartData)






    let daily = {
        lineChartData: lineChartData,
        t1: getTargetsDataPoints(targetPercent1, startbalance, lineChartData, 't1'),
        t2: getTargetsDataPoints(targetPercent2, startbalance, lineChartData, 't2')
    }


    return daily


}

const getDashboardStats = async (options) => {
    var dashboard = {
        stats: {
            earnings: 1000,
            avg: 50,
            tradecount: 12,
            biggestwin: 24,
            biggestloss: 55,
            winrate: 40
        }
    }

    var startDayly = new Date(options.startDate);
    startDayly.setHours(0, 0, 0, 0);

    var endDayly = new Date(options.endDate);
    endDayly.setHours(23, 59, 59, 999);


    var wStrategy = ""
    if (options.strategy != "" && (options.strategy != undefined || options.strategy != "undefined")) {
        wStrategy = ' AND j.STRATEGY = "' + options.strategy + '" '
    }
    var wIsLinked = ""
    if (options.isLinked == true) {
        wIsLinked = ' AND jh.ID_History not NULL '
    }
    var wIsDocumented = ""
    if (options.isDocumented == true) {
        wIsDocumented = ' AND j.ISDOCUMENTED = "true" '
    }

    var sql = ' select MAX(h.TIMESTAMP) , MIN(h.BETRAG) as biggestloss , MAX(h.BETRAG) as biggestwin , count(*) as count, '
        + ' SUM(h.BETRAG) as betrag, sum(case when Betrag > 0 then 1 else 0 end) as win '
        + ' from HISTORY as h '
        + ' LEFT JOIN JOURNALHISTORYMAP as jh ON jh.ID_History = h.AUFTRAGSNR'
        + ' LEFT JOIN JOURNAL j  ON j.ID = jh.ID_Trade'
        + ' where  h.betrag != 0  AND h.betrag != "-"  AND h.TIMESTAMP BETWEEN  ' + startDayly.getTime() + ' and ' + endDayly.getTime()
        + ' ' + wStrategy + wIsLinked + wIsDocumented
    let ret = await myDB.get(sql)
    let winrate = Number(ret[0].win) / Number(ret[0].count) * 100
    winrate = Math.round(winrate * 10) / 10;

    dashboard.stats.avg = Number(0).toFixed(2)
    dashboard.stats.tradecount = Number(ret[0].count)
    dashboard.stats.biggestwin = Number(ret[0].biggestwin).toFixed(2)
    dashboard.stats.biggestloss = Number(ret[0].biggestloss).toFixed(2)
    dashboard.stats.earnings = Number(ret[0].betrag).toFixed(2)
    dashboard.stats.winrate = Number(winrate).toFixed(0)

    return dashboard
}



const getWinlosspercentile = async (options) => {
    let lineChartLimit = 50
    let periodSelect = "start of day"
    let timestamp = 0
    var date = new Date();
    if (options != undefined) {
        if (options.lineChart != undefined) {
            if (Number(options.lineChart.limit) != 0 && Number(options.lineChart.limit) != NaN) {
                lineChartLimit = Number(options.lineChart.limit)
            }
            if (options.lineChart.period != undefined) {
                if (options.lineChart.period == "Days") {
                    var startDayly = new Date();
                    startDayly.setHours(0, 0, 0, 0);
                    timestamp = startDayly.getTime()
                }
                if (options.lineChart.period == "Weeks") {
                    var startWeek = new Date();
                    for (i = 0; i < 8; i++) {
                        var n = startWeek.getDay()
                        if (n == 1) {
                            startWeek.setHours(0, 0, 0, 0);
                        } else {
                            startWeek.setDate(startWeek.getDate() - 1);
                        }
                    }
                    timestamp = startWeek.getTime()
                }
                if (options.lineChart.period == "Months") {
                    timestamp = new Date(date.getFullYear(), date.getMonth(), 1).getTime()
                }
                if (options.lineChart.period == "Years") {
                    timestamp = 0
                }
            }
        }
    }
    const sqlLineChartData = 'select BETRAG as betrag , BETRAG as label from HISTORY where  BETRAG != 0 AND BETRAG != "-"  and TYP != "Einzahlung"  and timestamp > ' + timestamp + ' order by BETRAG  DESC '
    const sqlCounter = 'select count(*) counter from HISTORY where  BETRAG != 0 AND BETRAG != "-"  and TYP != "Einzahlung"  and timestamp > ' + timestamp + '   '
    let lineChartData = await myDB.get(sqlLineChartData)
    let counter = await myDB.get(sqlCounter)
  
    counter = Number(lineChartData.length)
    start = counter

    let highestPercentile = {
        start: counter, // 100% - 90%
        end: counter - Math.round(counter * 0.1),
        sum:0
    }
    let highPercentile = {
        start: highestPercentile.end - 1, // 90% - 70%
        end: highestPercentile.end - Math.round(counter * 0.2),
        sum:0
    }

    let midPercentile = {
        start: highPercentile.end - 1, // 70% - 30%
        end: highPercentile.end - Math.round(counter * 0.4),
        sum:0
    }


    let lowPercentile = {
        start: midPercentile.end - 1, // 30% - 10%
        end: midPercentile.end - Math.round(counter * 0.2),
        sum:0
    }

    let lowestPercentile = {
        start: lowPercentile.end - 1, // 30% - 10%
        end: 0,
        sum:0
    }
    highestPercentile = calSum(highestPercentile , lineChartData)
    highPercentile = calSum(highPercentile , lineChartData)
    midPercentile = calSum(midPercentile , lineChartData)
    lowPercentile = calSum(lowPercentile , lineChartData)
    lowestPercentile = calSum(lowestPercentile , lineChartData)


    let ret = [
        {betrag: highestPercentile.sum, label: "90%"},
        {betrag: highPercentile.sum, label: "90%"},
        {betrag: midPercentile.sum, label: "90%"},
        {betrag: lowPercentile.sum, label: "90%"},
        {betrag: lowestPercentile.sum, label: "90%"},
    ]
    // berechne die anzahl der gesamt trades und teile die in percentile ein




    let daily = {
        lineChartData: ret,
    }
    return daily
}

function calSum(percentile, result){
    for(let i=percentile.end; i<percentile.start;i++){
        percentile.sum = percentile.sum + Number(result[i].betrag)
    }
    return percentile
}

const getWinlossdistribution = async (options) => {
    let lineChartLimit = 50
    let periodSelect = "start of day"
    let timestamp = 0
    var date = new Date();
    if (options != undefined) {
        if (options.lineChart != undefined) {
            if (Number(options.lineChart.limit) != 0 && Number(options.lineChart.limit) != NaN) {
                lineChartLimit = Number(options.lineChart.limit)
            }
            if (options.lineChart.period != undefined) {
                if (options.lineChart.period == "Days") {
                    var startDayly = new Date();
                    startDayly.setHours(0, 0, 0, 0);
                    timestamp = startDayly.getTime()
                }
                if (options.lineChart.period == "Weeks") {
                    var startWeek = new Date();
                    for (i = 0; i < 8; i++) {
                        var n = startWeek.getDay()
                        if (n == 1) {
                            startWeek.setHours(0, 0, 0, 0);
                        } else {
                            startWeek.setDate(startWeek.getDate() - 1);
                        }
                    }
                    timestamp = startWeek.getTime()
                }
                if (options.lineChart.period == "Months") {
                    timestamp = new Date(date.getFullYear(), date.getMonth(), 1).getTime()
                }
                if (options.lineChart.period == "Years") {
                    timestamp = 0
                }
            }
        }
    }

    const sqlLineChartData = 'select BETRAG as betrag , BETRAG as label from HISTORY where  BETRAG != 0 AND BETRAG != "-"  and TYP != "Einzahlung"  and timestamp > ' + timestamp + ' order by label  DESC limit ' + lineChartLimit + ' '

    let lineChartData = await myDB.get(sqlLineChartData)
    let daily = {
        lineChartData: lineChartData,
    }
    return daily
}

const getPerformanceLineFlow = async (options) => {
    let lineChartLimit = 50
    let periodSelect = "start of day"
    if (options != undefined) {
        if (options.lineChart != undefined) {
            if (Number(options.lineChart.limit) != 0 && Number(options.lineChart.limit) != NaN) {
                lineChartLimit = Number(options.lineChart.limit)
            }
            if (options.lineChart.period != undefined) {
                if (options.lineChart.period == "Days") periodSelect = "start of day"
                if (options.lineChart.period == "Weeks") periodSelect = "weekday 1"
                if (options.lineChart.period == "Months") periodSelect = "start of month"
                if (options.lineChart.period == "Years") periodSelect = "start of year"
            }
        }
    }
    const sqlLineChartData = 'select SUM(BETRAG) as result,  MAX(TIMESTAMP) as ts, DATE(strftime("%Y-%m-%d ", datetime(TIMESTAMP/1000, "unixepoch")) , "' + periodSelect + '") AS label,  KONTOSTAND as kontostand from HISTORY where  BETRAG != 0 AND BETRAG != "-"  and TYP != "Einzahlung" GROUP BY label order by label  DESC limit ' + lineChartLimit + ' '
    let lineChartData = await myDB.get(sqlLineChartData)

    const sqlDeposit = 'select SUM(BETRAG) as deposit,  MAX(TIMESTAMP) as ts , DATE(strftime("%Y-%m-%d ", datetime(TIMESTAMP/1000, "unixepoch")) , "' + periodSelect + '") AS label,  KONTOSTAND as kontostand from HISTORY where  BETRAG != 0 AND BETRAG != "-"  and TYP == "Einzahlung" GROUP BY label order by label  DESC limit ' + lineChartLimit + ' '
    let depositData = await myDB.get(sqlDeposit)


    lineChartData.reverse()
    depositData.reverse()
    Aggregated = []
    let sumDeposit = 0
    let lastTimestamp = 0
    let lastDepositTimestamp = 0
    aAggregated = []

    for (let i = 0; i < lineChartData.length; i++) {

        if (i == 0) { lastDepositTimestamp = lastTimestamp }
        if (lastTimestamp < Number(lineChartData[i].ts)) {
            lastTimestamp = Number(lineChartData[i].ts)
            // check for new deposit
            for (let n = 0; n < depositData.length; n++) {
                if (lastDepositTimestamp < Number(depositData[n].ts) && Number(depositData[n].ts) < Number(lineChartData[i].ts)) {
                    lastDepositTimestamp = Number(depositData[n].ts)
                    sumDeposit = sumDeposit + Number(depositData[n].deposit)
                }
            }

        }
        let temp = Number(lineChartData[i].kontostand) - Number(sumDeposit)
        aAggregated.push(temp)
        lineChartData[i].agg = temp
    }

    let daily = {
        lineChartData: lineChartData,
    }

    return daily
}


const getPerformanceLine = async (options) => {
    let lineChartLimit = 50
    let periodSelect = "start of day"
    if (options != undefined) {
        if (options.lineChart != undefined) {
            if (Number(options.lineChart.limit) != 0 && Number(options.lineChart.limit) != NaN) {
                lineChartLimit = Number(options.lineChart.limit)
            }
            if (options.lineChart.period != undefined) {
                if (options.lineChart.period == "Days") periodSelect = "start of day"
                if (options.lineChart.period == "Weeks") periodSelect = "weekday 1"
                if (options.lineChart.period == "Months") periodSelect = "start of month"
                if (options.lineChart.period == "Years") periodSelect = "start of year"
            }
        }
    }
    const sqlLineChartData = 'select SUM(BETRAG) as result,  MAX(TIMESTAMP) as ts, DATE(strftime("%Y-%m-%d ", datetime(TIMESTAMP/1000, "unixepoch")) , "' + periodSelect + '") AS label,  KONTOSTAND as kontostand from HISTORY where  BETRAG != 0 AND BETRAG != "-"  and TYP != "Einzahlung" GROUP BY label order by label  DESC limit ' + lineChartLimit + ' '
    let lineChartData = await myDB.get(sqlLineChartData)

    const sqlDeposit = 'select SUM(BETRAG) as deposit,  MAX(TIMESTAMP) as ts , DATE(strftime("%Y-%m-%d ", datetime(TIMESTAMP/1000, "unixepoch")) , "' + periodSelect + '") AS label,  KONTOSTAND as kontostand from HISTORY where  BETRAG != 0 AND BETRAG != "-"  and TYP == "Einzahlung" GROUP BY label order by label  DESC limit ' + lineChartLimit + ' '
    let depositData = await myDB.get(sqlDeposit)

    lineChartData.reverse()

    depositData.reverse()

    Aggregated = []
    let sumDeposit = 0
    let lastTimestamp = 0
    let lastDepositTimestamp = 0
    aAggregated = []

    for (let i = 0; i < lineChartData.length; i++) {
        let newDeposit = 0
        if (lastTimestamp < Number(lineChartData[i].ts)) {
            lastTimestamp = Number(lineChartData[i].ts)
            // check for new deposit
            newDeposit = 0
            for (let n = 0; n < depositData.length; n++) {
                if (lastDepositTimestamp < Number(depositData[n].ts) && Number(depositData[n].ts) < Number(lineChartData[i].ts)) {
                    lastDepositTimestamp = Number(depositData[n].ts)
                    sumDeposit = sumDeposit + Number(depositData[n].deposit)
                    newDeposit = Number(depositData[n].deposit)
                }
            }

        }

        let temp = 0
        if (i == 0) {
            lastKonto = lineChartData[i].kontostand - newDeposit
            temp = lastKonto
        } else {
            lastKonto = Number(lineChartData[i - 1].kontostand)
            temp = (Number(lineChartData[i].kontostand) - lastKonto) - newDeposit
        }

        aAggregated.push(temp)
        lineChartData[i].agg = temp
    }

    let daily = {
        lineChartData: lineChartData,
    }
    return daily
}

const getCurrentDailyStats = async (options) => {

    var startDayly = new Date();
    startDayly.setHours(0, 0, 0, 0);

    var endDayly = new Date();
    endDayly.setHours(23, 59, 59, 999);
    var startWeek = new Date();
    for (i = 0; i < 8; i++) {
        var n = startWeek.getDay()
        if (n == 1) {
            startWeek.setHours(0, 0, 0, 0);
        } else {
            startWeek.setDate(startWeek.getDate() - 1);
        }
    }
    var endWeek = new Date(startWeek.getTime())
    endWeek.setDate(endWeek.getDate() + 5)

    const sqlBarChartWeek = 'select DATE(strftime("%Y-%m-%d ", datetime(TIMESTAMP/1000, "unixepoch")) , "weekday 1") AS this_monday, count(*) as count, SUM(BETRAG) as betrag, sum(case when Betrag > 0 then 1 else 0 end) as win   from HISTORY where  betrag != 0  AND betrag != "-"  GROUP BY this_monday order by this_monday  DESC limit 5 '
    const sqlBarChartDay = 'select DATE(strftime("%Y-%m-%d ", datetime(TIMESTAMP/1000, "unixepoch")) , "start of day") AS this_monday, count(*) as count, SUM(BETRAG) as betrag, sum(case when Betrag > 0 then 1 else 0 end) as win   from HISTORY where  betrag != 0  AND betrag != "-"  GROUP BY this_monday order by this_monday  DESC limit 5 '


    let lineChartLimit = 50
    let periodSelect = "start of day"
    if (options != undefined) {
        if (options.lineChart != undefined) {
            if (Number(options.lineChart.limit) != 0 && Number(options.lineChart.limit) != NaN) {
                lineChartLimit = Number(options.lineChart.limit)
            }
            if (options.lineChart.period != undefined) {
                if (options.lineChart.period == "Days") periodSelect = "start of day"
                if (options.lineChart.period == "Weeks") periodSelect = "weekday 1"
                if (options.lineChart.period == "Months") periodSelect = "start of month"
                if (options.lineChart.period == "Years") periodSelect = "start of year"
            }
        }
    }

    const sqlLineChartData = 'select  MAX(TIMESTAMP) , DATE(strftime("%Y-%m-%d ", datetime(TIMESTAMP/1000, "unixepoch")) , "' + periodSelect + '") AS label,  KONTOSTAND as kontostand from HISTORY where  KONTOSTAND != 0 AND KONTOSTAND != "-" AND betrag != "-"  GROUP BY label order by label  DESC limit ' + lineChartLimit + ' '
    const sqlDailyCount = 'select  MAX(TIMESTAMP) , count(*) as count, SUM(BETRAG) as betrag, sum(case when Betrag > 0 then 1 else 0 end) as win   from HISTORY where  betrag != 0  AND betrag != "-"  AND TIMESTAMP BETWEEN  ' + startDayly.getTime() + ' and ' + endDayly.getTime()
    const sqlWeekly = 'select  MAX(TIMESTAMP) , count(*) as count, SUM(BETRAG) as betrag, sum(case when Betrag > 0 then 1 else 0 end) as win   from HISTORY where  betrag != 0  AND betrag != "-"  AND TIMESTAMP BETWEEN  ' + startWeek.getTime() + ' and ' + endWeek.getTime()

    let barChartWeek = await myDB.get(sqlBarChartWeek)
    barChartWeek.reverse()
    let barChartDay = await myDB.get(sqlBarChartDay)
    barChartDay.reverse()

    let lineChartData = await myDB.get(sqlLineChartData)
    lineChartData.reverse()

    let dailyCount = await myDB.get(sqlDailyCount)
    let winrate = Number(dailyCount[0].win) / Number(dailyCount[0].count) * 100
    winrate = Math.round(winrate * 10) / 10;

    winrate = Number(winrate).toFixed(2)
    dailyCount[0].betrag = Number(dailyCount[0].betrag).toFixed(2)

    let weekly = await myDB.get(sqlWeekly)
    let weeklyWinrate = Number(weekly[0].win) / Number(weekly[0].count) * 100
    weeklyWinrate = Math.round(weeklyWinrate * 10) / 10;

    weeklyWinrate = Number(weeklyWinrate).toFixed(2)
    weekly[0].betrag = Number(weekly[0].betrag).toFixed(2)

    let daily = {
        lineChartData: lineChartData,

        barChartWeek: barChartWeek,
        barChartDay: barChartDay,
        daily:
        {
            tradeCount: dailyCount[0].count,
            winRate: winrate,
            sum: dailyCount[0].betrag
        },
        weekly: {
            tradeCount: weekly[0].count,
            winRate: weeklyWinrate,
            sum: weekly[0].betrag
        }
    }
    return daily
}

function getSingleRiskCheck(risk, balance) {
    var maxRisk = Number(balance) * singleRiskPerTrade
    var ret = 'mdi-check-circle-outline'
    risk = Number(risk) * -1

    if (Number(risk) > maxRisk) {
        ret = 'mdi-alert-circle-outline'
    }
    return ret
}


const getTargets = async (options) => {
    let konto = await this.getKontostand(options)
    var ret = konto

    ret.targets = {
        year: {
            T1: {
                percent: yearT1,
                sum: ((Number(yearT1) / 100) * (Number(konto.kontostandYearstart)) + Number(konto.kontostandYearstart)).toFixed(2),
                difPercent: (Number(konto.currentkontostand) / ((Number(yearT1) / 100) * (Number(konto.kontostandYearstart)) + Number(konto.kontostandYearstart)) * 100).toFixed(2)
            },
            T2: {
                percent: yearT2,
                sum: ((Number(yearT2) / 100) * (Number(konto.kontostandYearstart)) + Number(konto.kontostandYearstart)).toFixed(2),
                difPercent: (Number(konto.currentkontostand) / ((Number(yearT2) / 100) * (Number(konto.kontostandYearstart)) + Number(konto.kontostandYearstart)) * 100).toFixed(2)
            }
        },
        month: {
            T1: {
                percent: monthT1,
                sum: ((Number(monthT1) / 100) * (Number(konto.kontostandMonthstart)) + Number(konto.kontostandMonthstart)).toFixed(2),
                difPercent: (Number(konto.currentkontostand) / ((Number(monthT1) / 100) * (Number(konto.kontostandMonthstart)) + Number(konto.kontostandMonthstart)) * 100).toFixed(2)
            },
            T2: {
                percent: monthT2,
                sum: ((Number(monthT2) / 100) * (Number(konto.kontostandMonthstart)) + Number(konto.kontostandMonthstart)).toFixed(2),
                difPercent: (Number(konto.currentkontostand) / ((Number(monthT2) / 100) * (Number(konto.kontostandMonthstart)) + Number(konto.kontostandMonthstart)) * 100).toFixed(2)
            }
        },
        week: {
            T1: {
                percent: weakT1,
                sum: ((Number(weakT1) / 100) * (Number(konto.kontostandWeekstart)) + Number(konto.kontostandWeekstart)).toFixed(2),
                difPercent: (Number(konto.currentkontostand) / ((Number(weakT1) / 100) * (Number(konto.kontostandWeekstart)) + Number(konto.kontostandWeekstart)) * 100).toFixed(2)
            },
            T2: {
                percent: weakT2,
                sum: ((Number(weakT2) / 100) * (Number(konto.kontostandWeekstart)) + Number(konto.kontostandWeekstart)).toFixed(2),
                difPercent: (Number(konto.currentkontostand) / ((Number(weakT2) / 100) * (Number(konto.kontostandWeekstart)) + Number(konto.kontostandWeekstart)) * 100).toFixed(2)
            }
        },
        day: {
            T1: {
                percent: dayT1,
                sum: ((Number(dayT1) / 100) * (Number(konto.kontostand)) + Number(konto.kontostand)).toFixed(2),
                difPercent: (Number(konto.currentkontostand) / ((Number(dayT1) / 100) * (Number(konto.kontostand)) + Number(konto.kontostand)) * 100).toFixed(2)

            },
            T2: {
                percent: dayT2,
                sum: ((Number(dayT2) / 100) * (Number(konto.kontostand)) + Number(konto.kontostand)).toFixed(2),
                difPercent: (Number(konto.currentkontostand) / ((Number(dayT2) / 100) * (Number(konto.kontostand)) + Number(konto.kontostand)) * 100).toFixed(2)

            }
        }
    }
    return ret
}


const getKontostand = async (options) => {
    var yearStart = "2021-01-01"

    const sqlKontostandCurrent = 'select TIMESTAMP,   KONTOSTAND as kontostand from HISTORY where  KONTOSTAND != 0 AND KONTOSTAND != "-" order by TIMESTAMP  DESC   '
    let currentkontostand = await myDB.get(sqlKontostandCurrent)
   
    if(currentkontostand[0] == undefined){
        currentkontostand = 1
    }else{
        currentkontostand = Number(currentkontostand[0].kontostand)
    }
    

    var startDayly = new Date();
    startDayly.setDate(startDayly.getDate() - 1);
    startDayly.setHours(0, 0, 0, 0);
    var endDayly = new Date();
    endDayly.setDate(endDayly.getDate() - 1);
    endDayly.setHours(23, 59, 59, 999);

    let sqlKontostand = 'select TIMESTAMP,   KONTOSTAND as kontostand from HISTORY where TIMESTAMP BETWEEN  ' + startDayly.getTime() + ' and ' + endDayly.getTime() + '  and  KONTOSTAND != 0 AND KONTOSTAND != "-" order by TIMESTAMP  DESC   '
    let kontostand = await myDB.get(sqlKontostand)
    if (kontostand[0] == undefined) {
        startDayly = new Date();
        startDayly.setHours(0, 0, 0, 0);
        endDayly = new Date();
        endDayly.setHours(23, 59, 59, 999);
        sqlKontostand = 'select TIMESTAMP,   KONTOSTAND as kontostand from HISTORY where TIMESTAMP BETWEEN  ' + startDayly.getTime() + ' and ' + endDayly.getTime() + '  and  KONTOSTAND != 0 AND KONTOSTAND != "-" order by TIMESTAMP  DESC   '
        kontostand = await myDB.get(sqlKontostand)
        if (kontostand[0] == undefined) {
            sqlKontostand = 'select TIMESTAMP,   KONTOSTAND as kontostand from HISTORY where  KONTOSTAND != 0 AND KONTOSTAND != "-" order by TIMESTAMP  DESC   '
            kontostand = await myDB.get(sqlKontostand)
        }
    }
    if(kontostand[0] == undefined){
        kontostand = 1
    }else{
        kontostand = Number(kontostand[0].kontostand)
    }
   

    var startWeek = new Date();
    for (i = 0; i < 8; i++) {
        var n = startWeek.getDay()
        if (n == 1) {
            startWeek.setHours(0, 0, 0, 0);
        } else {
            startWeek.setDate(startWeek.getDate() - 1);
        }
    }
    var endWeek = new Date(startWeek.getTime())
    endWeek.setDate(endWeek.getDate() + 5)
    const sqlKontostandWeekstart = 'select TIMESTAMP,   KONTOSTAND as kontostand from HISTORY where  KONTOSTAND != 0 AND KONTOSTAND != "-" AND betrag != "-" AND  TIMESTAMP BETWEEN  ' + startWeek.getTime() + ' and ' + endWeek.getTime() + '  order by TIMESTAMP  ASC   '
    let kontostandWeekstart = await myDB.get(sqlKontostandWeekstart)
    if (kontostandWeekstart[0] == undefined) {
        kontostandWeekstart = 1
    }else{
        kontostandWeekstart = kontostand
    }
   

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    const sqlKontostandMonthstart = 'select TIMESTAMP,   KONTOSTAND as kontostand from HISTORY where  KONTOSTAND != 0 AND KONTOSTAND != "-" AND betrag != "-" AND  TIMESTAMP BETWEEN  ' + firstDay.getTime() + ' and ' + endDayly.getTime() + '  order by TIMESTAMP  ASC   '
    let kontostandMonthstart = await myDB.get(sqlKontostandMonthstart)
    if (kontostandMonthstart[0] == undefined) { 
        kontostandMonthstart = 1
    }else{
        kontostandMonthstart = Number(kontostandMonthstart[0].kontostand) 
    }


    var startYear = new Date(yearStart);
    startYear.setHours(0, 0, 0, 0);
    const sqlKontostandYearstart = 'select TIMESTAMP,   KONTOSTAND as kontostand from HISTORY where  KONTOSTAND != 0 AND KONTOSTAND != "-" AND betrag != "-" AND  TIMESTAMP BETWEEN  ' + startYear.getTime() + ' and ' + endDayly.getTime() + '  order by TIMESTAMP  ASC   '
    let kontostandYearstart = await myDB.get(sqlKontostandYearstart)
  
    if(kontostandYearstart[0] == undefined){
        kontostandYearstart = 1
    }else{
        kontostandYearstart = Number(kontostandYearstart[0].kontostand)
    }
   

    return {
        kontostand: kontostand,
        kontostandYearstart: kontostandYearstart,
        kontostandWeekstart: kontostandWeekstart,
        kontostandMonthstart: kontostandMonthstart,
        currentkontostand: currentkontostand
    }
}

const getPositions = async () => {
    const sqlPosition = 'select * from POSITION '
    let position = await myDB.get(sqlPosition)


    let options = {}
    let konto = await this.getKontostand(options)
    let kontostand = konto.kontostand

    var startDayly = new Date();
    startDayly.setHours(0, 0, 0, 0);

    var endDayly = new Date();
    endDayly.setHours(23, 59, 59, 999);


    let aPositions = []
    let riskSum = 0
    let tpSum = 0
    let bestCase = 0
    let worstCase = 0

    for (let i = 0; i < position.length; i++) {
  
        let risk = (((1 - (Number(position[i].SL) / Number(position[i].KURS))) * Number(position[i].BETRAG)) * -1)
        if (position[i].KV == 'V') risk = risk * -1

        if(position[i].IGNORE == "true"){
            risk = 0
        }
        
        riskSum = Number(riskSum) + risk
        var myTP = ((1 - (Number(position[i].TP) / Number(position[i].KURS))) * Number(position[i].BETRAG)) * -1 // ((Number(position[i].TP) * Number(position[i].ANZAHL)) - (Number(position[i].KURS) * Number(position[i].ANZAHL)))
        if (!isNaN(myTP)) tpSum = Number(tpSum) + myTP
        if (position[i].KV == 'V') myTP = myTP * -1



        let temp = {
            ignore: position[i].IGNORE,
            symbol: position[i].SYMBOL,
            ordernr: position[i].POSITION,
            bought: position[i].KURS,
            count: position[i].ANZAHL,
            betrag: position[i].BETRAG,
            sl: position[i].SL,
            risk: risk.toFixed(2),
            tp: position[i].TP,
            profit: myTP.toFixed(2),
            riskcheck: getSingleRiskCheck(risk, kontostand)
        }
        
        aPositions.push(temp)
    }

    worstCase = konto.currentkontostand + riskSum
    bestCase = konto.currentkontostand + tpSum




    let ret = {
        position: {
            total: {
                konto: kontostand.toFixed(2),
                risk: riskSum.toFixed(2),
                tp: tpSum.toFixed(2),
                worstCase: worstCase.toFixed(2),
                bestCase: bestCase.toFixed(2),
                usedSum: "",
                kontostandDayStart: kontostand.toFixed(2),
                sumMaxDayRisk: getSumDayRisk(kontostand),
                currentDayRiskPercent: getCurrentDayRiskPercent(kontostand, riskSum),
                sumOpenDayRisk: getSumOpenDayRisk(kontostand, riskSum),
                totalCRV: getTotalCRV(tpSum, riskSum)
            },
            positions: aPositions
        }
    }
    return ret
}

function getTotalCRV(tp, risk) {
    return tp / risk * 100 * -1
}

function getSumOpenDayRisk(balance, risk) {
    var maxSumRisk = getSumDayRisk(balance)
    risk = Number(risk) * -1
    var ret = (Number(maxSumRisk) - Number(risk))
    ret = ret.toFixed(2)
    return ret
}

function getCurrentDayRiskPercent(balance, risk) {
    risk = Number(risk) * -1
    var percent = risk / balance * 100
    percent = percent.toFixed(2)
    return percent
}

function getSumDayRisk(balance) {
    return (Number(maxDayRisk) * Number(balance)).toFixed(2)
}




exports.getCurrentDailyStats = getCurrentDailyStats;
exports.getPositions = getPositions;
exports.getDashboardStats = getDashboardStats
exports.getKontostand = getKontostand
exports.getTargets = getTargets
exports.getPerformanceLine = getPerformanceLine
exports.getTargetChart = getTargetCharts
exports.getPerformanceLineFlow = getPerformanceLineFlow
exports.getWinlossdistribution = getWinlossdistribution
exports.getWinlosspercentile = getWinlosspercentile
exports.getDayRisk = getDayRisk
exports.setPositionIgnore = setPositionIgnore
