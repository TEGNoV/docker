hound = require('hound')
const fs = require('fs')
const myDB = require('../database/database');
const cfg = require('./../../config/config.json');

const path = require("path")

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



    console.log("-------------------------------")
    console.log("import file: " + file)
    console.log("-------------------------------")


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
  
  if(array1.length != array2.length){
      return false
  }

  let check = true
  for (var i = 0; i<array1.length-1; i++) {
      if(array1[i] != array2[i]){
          check = false
      }
  }

  return check
}

async function importFile(path, typ , filename) {
  try {
    console.log("try import")
    let myArr = await readCSV(path)

    if(compareArray(aHistoryCheckArray, myArr[0] )){
      console.log("History File!!!!!!!")
      await myDB.importCMCHistory(myArr)
      await sleep(2000)
      await deleteFile(path)
    }
    else if(compareArray(aPositionCheckArray, myArr[0] )){
      console.log("Position File!!!!!!!")
      await myDB.importCMCPosition(myArr)
      await sleep(2000)
      await deleteFile(path)
    } 
    else if(checkPicture(path)){
      console.log("Picture")
      await sleep(2000)
      await movefile(path , filename)

    }   
    else{
      console.log("No Idea File!!!!!!!")
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
  try {
    fs.unlinkSync(path)
    console.log("Delete: " + path)
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