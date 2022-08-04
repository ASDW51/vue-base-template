module.exports = {
	overrides: [
		{
			files: [
				"**/__tests__/*.{j,t}s?(x)",
				"**/tests/unit/**/*.spec.{j,t}s?(x)"
			],
			env: {
				jest: true
			}
		}
	],
	root: true,
	env: {
		node: true
	},
	"extends": [
		"plugin:vue/essential",
		"eslint:recommended"
	],
	parserOptions: {
		parser: "@babel/eslint-parser"
	},
	rules: {
		"vue/multi-word-component-names":[0],
		"no-irregular-whitespace":["error",{skipComments:true,skipStrings:true,skipRegExps:true,skipTemplates:true}],
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"indent":["error","tab"],  //tab键缩进
		"quotes":["error","double"], //使用双引号
		"semi":["error","never",{beforeStatementContinuationChars:"always"}]  //bu分号结尾
	}
}
