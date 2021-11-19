const express = require('express')
const path = require("path")
const login = require("./login2")
const cfg = require('./../../config/config.json');
require('events').EventEmitter.defaultMaxListeners = 15;

const Server = () =>  {
  let app = express()
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

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  });
}

exports.Server = Server;
