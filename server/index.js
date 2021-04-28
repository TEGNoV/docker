console.log("")
console.log(process.env.DOCKER)
const myExpress = require('./libs/express/main');
const myImport = require('./libs/import/main');
const myDB = require('./libs/database/database');

myDB.init()
myImport.watch()  
myExpress.Server() 