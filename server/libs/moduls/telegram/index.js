const TelegramBot = require("node-telegram-bot-api");

class telegram_main {
  constructor() {
    this.bot = null
    
  }

  async initTG(token, chatID , polling , type){
    var ret
    try{
     
        this.token = '549451708:AAEpQPD_DcKOJRsoyDlBvRV5dp5RjckyKak'
        this.chatID = 452889849;
        if(polling){
          //this.bot = new TelegramBot(token, {polling: { interval : 100, params:{ timeout: 1000 } } })
          this.bot = new TelegramBot(token, {polling: false })
          this.tester = this.bot
        }else{
          this.bot = new TelegramBot(token, {polling: false })
        }
        ret = {
          "msg" : "Created Telegram object "+type ,
          "status" : 1,
          "typ" : "Init"
        }
       
        this.bot.sendMessage(this.chatID, "init");
      
    }catch(e){
      ret = {
        "msg" : e ,
        "status" : -1,
        "typ" : "Init"
      }
    }
    console.log(ret)
    return ret
  }

  async sendMSG(msg) {
      this.bot.sendMessage(this.chatID, msg);
  }

}
module.exports = telegram_main;
