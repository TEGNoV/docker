const express = require('express')
const path = require("path")
const login = require("./login2")
const cfg = require('./../../config/config.json');
require('events').EventEmitter.defaultMaxListeners = 15;

const Server = async() =>  {
  
  let app = express()
  const app_route = express.Router();
  login.login(app)
  app.use("/",express.static(path.join(__dirname, "../../dist/")));
  let picpath = "./PICTURE"
  if(cfg.customPicture){
    picpath = cfg.customPictureFolder
  }
  if(process.env.DOCKER == 'true'){
    picpath = "/picture"
  }

  app.use(function(req, res, next) {
    if (!req.isAuthenticated() && req.path.indexOf('/images') === 0)
    {
        res.redirect('/login');
    }
    next(); 
});

  app.use('/images', express.static(picpath));
  
  /* --------------------------------------------------------
                          Dashboard
  ----------------------------------------------------------- */
  const bodyParser = require('body-parser')  
  var jsonParser = bodyParser.json()

  app.use(express.text());
  app.post('/api/webhook', jsonParser, async function  (req, res) {
    const myTelegram = require(path.join(__dirname, "../moduls/telegram/index"));
    this.tg_msg =  new myTelegram()
    await this.tg_msg.initTG("549451708:AAEpQPD_DcKOJRsoyDlBvRV5dp5RjckyKak", '' , true , "message") 
  
    console.log(req.body); // If the request has Content-Type text/plain, the body will be parsed as text.
    if(req.body != undefined){
      await this.tg_msg.sendMSG(req.body)
    }else{
      console.log(req)
      console.log("Body is undefined")

    }
    

  })


  const overview = require("./routes/route_dashboard");
  app.use("/", overview);

  const risk = require("./routes/route_risk");
  app.use("/", risk);

  const dashboardPositions = require("./routes/route_dashboardPositions");
  app.use("/", dashboardPositions);

  const journalCreate  = require("./routes/route_journalCreate");
  app.use("/", journalCreate);

  const journal  = require("./routes/route_journal");
  app.use("/", journal);

  
  const auswertung  = require("./routes/route_auswertung");
  app.use("/", auswertung); 
  
  const trades  = require("./routes/route_trades");
  app.use("/", trades);

  const comment  = require("./routes/route_comment");
  app.use("/", comment);

  const log  = require("./routes/route_log");
  app.use("/", log);

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../../dist/index.html"))
  });

  app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
  });
}

exports.Server = Server;
