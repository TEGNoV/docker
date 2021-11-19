
var expect    = require("chai").expect;
const path = require("path")
const trades = require(path.join(__dirname, "../../moduls/trades/trades"));
var expect    = require("chai").expect;
const myTime = require('./../../moduls/time/myTime');

describe('#Trades', () => {
  it('All Trades', async () => {
    await myTime.setTimestampToday(1633092275000 , "true")
    let ret = await trades.getTrades()
    let expected =  { tradeItems: [ { auftragsnr: 'O3-9C-5VEJK8', betrag: -0.69, typ: 'GSLO Prämie', produkt: 'US SPX 500 - Dez 2021', verlinkt: false, datum: '01 Okt 2021 20:08:41', myid: undefined, map: [], pic: false }, { auftragsnr: 'O3-9C-5VEJJ3', betrag: -0.38, typ: 'GSLO Prämie', produkt: 'US 30 - Dez 2021', verlinkt: false, datum: '01 Okt 2021 20:08:08', myid: undefined, map: [], pic: false }, { auftragsnr: 'O3-9C-5VEJGY', betrag: -0.51, typ: 'GSLO Prämie', produkt: 'US NDAQ 100 - Dez 2021', verlinkt: false, datum: '01 Okt 2021 20:07:38', myid: undefined, map: [], pic: false }, { auftragsnr: 'O3-9C-5VDT22', betrag: -46.6, typ: 'Stop-Loss (ausgeführt)', produkt: 'US NDAQ 100 - Dez 2021', verlinkt: false, datum: '01 Okt 2021 16:23:25', myid: undefined, map: [], pic: false }, { auftragsnr: '987709275', betrag: -8.67, typ: 'Kommission', produkt: 'Apple', verlinkt: false, datum: '01 Okt 2021 16:15:21', myid: undefined, map: [], pic: false }, { auftragsnr: 'O3-9B-5TTBX3', betrag: -238.18, typ: 'Stop-Loss (ausgeführt)', produkt: 'Apple', verlinkt: false, datum: '01 Okt 2021 16:15:21', myid: undefined, map: [], pic: false }, { auftragsnr: 'O3-9C-5VDHXX', betrag: -0.69, typ: 'GSLO Prämie', produkt: 'US SPX 500 - Dez 2021', verlinkt: false, datum: '01 Okt 2021 14:30:02', myid: undefined, map: [], pic: false }, { auftragsnr: 'O3-9C-5VDHX5', betrag: -0.51, typ: 'GSLO Prämie', produkt: 'US NDAQ 100 - Dez 2021', verlinkt: false, datum: '01 Okt 2021 14:29:44', myid: undefined, map: [], pic: false }, { auftragsnr: 'O3-9C-5VDHWB', betrag: -0.38, typ: 'GSLO Prämie', produkt: 'US 30 - Dez 2021', verlinkt: false, datum: '01 Okt 2021 14:29:22', myid: undefined, map: [], pic: false }, { auftragsnr: 'O3-9C-5VBCXG', betrag: -101.43, typ: 'Stop-Loss (ausgeführt)', produkt: 'US NDAQ 100 - Dez 2021', verlinkt: false, datum: '01 Okt 2021 03:08:07', myid: undefined, map: [], pic: false }, { auftragsnr: 'O3-9C-5VBCSV', betrag: -110.55, typ: 'Stop-Loss (ausgeführt)', produkt: 'US 30 - Dez 2021', verlinkt: false, datum: '01 Okt 2021 03:03:53', myid: undefined, map: [], pic: false } ], products: [ 'all', 'US SPX 500 - Dez 2021', 'US 30 - Dez 2021', 'US NDAQ 100 - Dez 2021', 'Apple' ], total: '-508.59', avg: '-46.24', winrate: '0.00', avgwinner: 'NaN', avgloser: '-46.24', maxwinner: '0.00', maxloser: '-238.18' }
    expect(ret).to.deep.equal(expected);
  })
})