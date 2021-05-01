const path = require("path");
module.exports = {
  outputDir: path.resolve(__dirname, "../server/dist/"),
  //assetsDir: "../../server/dist/static/",
  "transpileDependencies": [
    "vuetify"
  ],
  devServer:{
    proxy:{
      '^/api':{
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      },
      '^/images':{
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      }
    }
  }
}

