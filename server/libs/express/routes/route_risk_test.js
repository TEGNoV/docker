
var expect    = require("chai").expect;
const path = require("path")
const stats = require(path.join(__dirname, "../../moduls/dashboard/dashboard"));
var expect    = require("chai").expect;
const myTime = require('../../moduls/time/myTime');

describe('#Route Risk', () => {
  it('All Trades', async () => {
    //await myTime.setTimestampToday(1635527126000 , "true")

    await myTime.setTimestampToday(  1637431119000 , "true")
    let ret = await stats.getDayRisk()
    console.log(ret)
    let expected =  
    {
      chartDataDay: {
        total: '856.28',
        maxRisk: '88.95',
        chartdata: [ -0, 856.2810000000001, 0, 0, 0, '88.95' ]
      },
      chartDataWeek: {
        total: '767.35',
        maxRisk: '0.02',
        chartdata: [ -0, 767.35, 0, 0, 0, '0.02' ]
      },
      chartDataMonth: {
        total: '767.38',
        maxRisk: '0.05',
        chartdata: [ -0, 767.38, 0, 0, 0, '0.05' ]
      },
      risk: { allowedLose: 0, openRisk: 0, current: 0, availableRisk: 0 }
    }
    expect(ret).to.deep.equal(expected);
  })
})