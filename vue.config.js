const { defineConfig } = require("@vue/cli-service");
var path = require("path")
function resolve(dir){
  let aliasPath = path.join(__dirname,dir)
  return aliasPath
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  publicPath:process.env.NODE_ENV=='development'?'/':'./',
  configureWebpack:{
    resolve:{
      alias:{
        "@":resolve("src")
      },
      fallback:{
        path:require.resolve("path-browserify")
      }
    }
  },
  devServer:{
    proxy:{
      '/':{
        target:process.env.VUE_APP_REQUEST_URL,
        changeOrigin:true,
        ws:false,
        pathRewrite:{
          '^/':""
        }
      }
    }
  }
});
