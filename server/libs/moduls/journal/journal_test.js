// test/converter.js

var expect    = require("chai").expect;
const journal = require('./journal');
const myTime = require('./../time/myTime');

describe('#Journal', () => {
  it('returns foo', async () => {
    await myTime.setTimestampToday(1633092275000 , "true")
    let ret = await journal.getAllJournal()
    console.log(ret)
  })
})