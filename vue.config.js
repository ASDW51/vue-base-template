const { defineConfig } = require("@vue/cli-service")
var path = require("path")
function resolve(dir){
	let aliasPath = path.join(__dirname,dir)
	return aliasPath
}
const isProduction = process.env.NODE_ENV == "production"
module.exports = defineConfig({
	chainWebpack:(config)=>{
		config.plugin("html").tap((args) => {
			args[0].title = ""
			return args
		})
	},
	transpileDependencies: true,
	lintOnSave:!isProduction,
	publicPath:isProduction?"./":"/",
	productionSourceMap:!isProduction,
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
		host:"0.0.0.0",
		proxy:{
			"/":{
				target:process.env.VUE_APP_REQUEST_URL,
				changeOrigin:true,
				ws:false,
				pathRewrite:{
					"^/":""
				}
			}
		},
		allowedHosts:"all"
	}
})
