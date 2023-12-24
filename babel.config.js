const prodPlugin = []
if(process.env.NODE_ENV==="production"){
	prodPlugin.push(["transform-remove-console",{exclude:["error","warn"]}])
}
module.exports = {
	presets: ["@vue/cli-plugin-babel/preset"],
	plugins:[...prodPlugin],
	env:{
		test:{
			plugins:["require-context-hook"]
		}
	}
}
