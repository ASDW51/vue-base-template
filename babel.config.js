const prodPlugin = [[
	"component",
	{
	  "libraryName": "element-ui",
	  "styleLibraryName": "theme-chalk"
	}
]]
if(process.env.NODE_ENV==="production"){
	prodPlugin.push(["transform-remove-console",{exclude:["error","warn"]}])
}
module.exports = {
	presets: ["@vue/cli-plugin-babel/preset",["@babel/preset-env", { "modules": false }]],
	plugins:[...prodPlugin],
	env:{
		test:{
			plugins:["require-context-hook"]
		}
	}
}
