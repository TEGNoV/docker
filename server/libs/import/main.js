hound = require('hound')
const fs = require('fs')
const myDB = require('../database/database');
const cfg = require('./../../config/config.json');

const path = require("path")

const log = require("../moduls/logging/log")
const MODUL = "main.js"
const LEVEL = 10

const unwatch = async (sql) => {
  watcher.clear()
}

const watch = async (sql) => {
  let path = "./IMPORT"
  if(cfg.customImport){
    path = cfg.customImportFolder
  }


  watcher = hound.watch(path)
  watcher.on('create', async file => {
    const FUNCTION = "watcher"
    log.log("import file: " + file , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")
    let filename = file.split(path).join("");
    await sleep(2000)
    await importFile(file, await checkFile(file) , filename)
  })
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function checkFile(path) {
  try {

  } catch (err) {
    console.error(err)
  }
  return "CMC_History"
}

function compareArray(array1 , array2){
  console.log(array1)
  console.log(array2)
  if(array1.length != array2.length){
      return false
  }

  let check = true
  for (var i = 0; i<array1.length-1; i++) {
      if(" " + array1[i].toString() != " " + array2[i].toString()){
        console.log(array1[i] + " != " + array2[i])
        console.log(array1[i].toString())
        console.log(array2[i].toString())
          check = false
      }
  }

  return check
}

async function importFile(path, typ , filename) {
  const FUNCTION = "importFile"
  try {
    log.log("import file: " + filename , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")
    let myArr = await readCSV(path)

    if(compareArray(aHistoryCheckArray, myArr[0] )){
      log.log("History File Detected: " + filename , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")
      await myDB.importCMCHistory(myArr)
      await sleep(2000)
      if(myArray == undefined)
      await deleteFile(path)
    }
    else if(compareArray(aHistoryCheckArray2, myArr[0] )){
      console.log("History File!!!!!!!")
      await myDB.importCMCHistory(myArr)
      await sleep(2000)
    }
    else if(compareArray(aPositionCheckArray, myArr[0] )){
      log.log("Position File Detected: " + filename , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")
      await myDB.importCMCPosition(myArr)
      await sleep(2000)
      if(myArray == undefined)
        await deleteFile(path)
    } 
    else if(compareArray(aPositionCheckArray2, myArr[0] )){
      console.log("Position File!!!!!!!")
      await myDB.importCMCPosition(myArr)
      await sleep(2000)
    } 
    else if(checkPicture(path)){
      log.log("Picture File Detected: " + filename , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")
      await sleep(2000)
      await movefile(path , filename)

    } 
    else{
      log.log("No Idea File Detected: " + filename , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")
      await sleep(2000)
      await deleteFile(path)
    }
  } catch (err) {
    console.error(err)
  }
}

function checkPicture(filename){
  const ext = path.extname(filename)
  if(ext == ".png"){return true}
  if(ext == ".jpg"){return true}
  return false
}

async function deleteFile(path) {
  const FUNCTION = "deleteFile"
  try {
    fs.unlinkSync(path)
    log.log("Delete: " + path , MODUL, FUNCTION, LEVEL, "EntryExit","DEBUG")

  } catch (err) {
    console.error(err)
  }
}

async function movefile(path , filename) {
  try {
    let picpath = "./PICTURE"
if(cfg.customPicture){
  picpath = cfg.customPictureFolder
}
if(process.env.DOCKER == 'true'){
  console.log("Change for Docker picture path")
  picpath = "/picture"
}
    await fs.renameSync(path ,  picpath + '' + filename );
    console.log("Delete: " + path)
  } catch (err) {
    console.error(err)
  }
}

async function readCSV(path) {
    const fs = require('fs')
    var contents = fs.readFileSync(path , 'utf8');
    let news = contents.split('","').join('";"')

     news = news.split('"').join('')
     

    let lineBr = news.split("\n");
    let array = []
    for (let i = 0; i < lineBr.length; i++) {
        let tempArray = lineBr[i].split(";")
        array.push(tempArray)
    }
    console.log(array)
    return array
}

exports.watch = watch;
exports.unwatch = unwatch;
exports.importFile = importFile;
exports.checkFile = checkFile;
exports.readCSV = readCSV

const aHistoryCheckArray = [
  '﻿DATUM/ZEIT',
  'TYP',
  'AUFTRAGSNR.',
  'TRADENR.',
  'ZUG. AUFTRAGSNR.',
  'PRODUKT',
  'ANZAHL/BETRAG',
  'KURS',
  'PREISGRENZE',
  'STOP-LOSS',
  'TAKE-PROFIT',
  'MARGIN (EUR)',
  'WECHSELKURS',
  'WERT (EUR)',
  'BETRAG (EUR)',
  'KONTOSTAND (EUR)',
  'BETRAG EXKLUSIVE DER GEBÜHR',
  'GEBÜHR',
  'HALTEKOSTEN - BETRAG',
  'HALTEKOSTENSATZ',
  'HALTEKOSTEN (EUR)',
  'HALTEKOSTEN - AUSGLEICH (EUR)',
  'HALTEKOSTEN - GESAMT (EUR)',
  'PRÄMIE',
  'RÜCKZAHLUNG %',
  'ZIEL',
  'GEWINN AUSZAHLEN',
  'GLEICHSTANDS-AUSZAHLUNG',
  'OFFEN',
  'LAUFZEIT',
  'ABSCHLUSS',
  'ENDPREIS',
  'ERGEBNIS',
  'AUSZAHLUNG',
  'TYP',
  'LAUFZEIT',
  'STRIKE-KURS',
  'ABSCHLUSS',
  'ENDPREIS',
  'GEWINN ',
  'VERLUST'
]
const aHistoryCheckArray2 = [
  'DATUM/ZEIT',
  'TYP',
  'AUFTRAGSNR.',
  'TRADENR.',
  'ZUG. AUFTRAGSNR.',
  'PRODUKT',
  'ANZAHL/BETRAG',
  'KURS',
  'PREISGRENZE',
  'STOP-LOSS',
  'TAKE-PROFIT',
  'MARGIN (EUR)',
  'WECHSELKURS',
  'WERT (EUR)',
  'BETRAG (EUR)',
  'KONTOSTAND (EUR)',
  'BETRAG EXKLUSIVE DER GEBÜHR',
  'GEBÜHR',
  'HALTEKOSTEN - BETRAG',
  'HALTEKOSTENSATZ',
  'HALTEKOSTEN (EUR)',
  'HALTEKOSTEN - AUSGLEICH (EUR)',
  'HALTEKOSTEN - GESAMT (EUR)',
  'PRÄMIE',
  'RÜCKZAHLUNG %',
  'ZIEL',
  'GEWINN AUSZAHLEN',
  'GLEICHSTANDS-AUSZAHLUNG',
  'OFFEN',
  'LAUFZEIT',
  'ABSCHLUSS',
  'ENDPREIS',
  'ERGEBNIS',
  'AUSZAHLUNG',
  'TYP',
  'LAUFZEIT',
  'STRIKE-KURS',
  'ABSCHLUSS',
  'ENDPREIS',
  'GEWINN ',
  'VERLUST'
]
const aPositionCheckArray = [
  '﻿POSITION/AUFTRAGSNR.',
  'K/V',
  'ANZAHL',
  'BETRAG',
  'KURS',
  'WECHSELKURS',
  'MARGIN',
  'GESAMT-PERF. G&V - %',
  'GESAMT-PERF. G&V - Pkt.',
  'GESAMT G&V',
  'STOP-LOSS',
  'TAKE-PROFIT',
  'VERKAUF',
  'KAUF'
]

const aPositionCheckArray2 = [
  'POSITION/AUFTRAGSNR.',
  'K/V',
  'ANZAHL',
  'BETRAG',
  'KURS',
  'WECHSELKURS',
  'MARGIN',
  'GESAMT-PERF. G&V - %',
  'GESAMT-PERF. G&V - Pkt.',
  'GESAMT G&V',
  'STOP-LOSS',
  'TAKE-PROFIT',
  'VERKAUF',
  'KAUF'
]