
var expect    = require("chai").expect;
const path = require("path")
const journal = require(path.join(__dirname, "../../moduls/journal/journal"));
var expect    = require("chai").expect;
const myTime = require('../../moduls/time/myTime');

describe('#Route Journal', () => {
  it('All Trades', async () => {
/*
req.query.startTime : 2021-11-20
Level: 10        Modul: route_trades.js  Function: /api/trades   msg: req.query.endTime: 2021-11-20
Level: 10        Modul: route_trades.js  Function: /api/trades   msg: req.query.settings: {"product":"all"}
*/
    await myTime.setTimestampToday(  1637431119000 , "true")

    let req = {
      query:{
        startTime: "2021-10-01",
        endTime: "2021-10-07",
        settings: {product:"all"}
      }  
    }
    console.log(req.query.startTime)
    let ret = await journal.getAllJournal(req.query.startTime, req.query.endTime)
    console.log(ret)
    let expected = {}
    expect(ret).to.deep.equal(expected);
  })
})