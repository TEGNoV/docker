//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
console.log(process.env.DOCKER)
console.log("V21.2")
const myExpress = require('./libs/express/main');
const myImport = require('./libs/import/main');
const myDB = require('./libs/database/database');

myDB.init()
myImport.watch()  
myExpress.Server() 