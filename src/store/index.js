import Vue from "vue"
import Vuex from "vuex"

const path = require("path")

Vue.use(Vuex)
//自动装载modules
const fileList = require.context("./modules",true,/\.js$/)
let modules = {}
fileList.keys().forEach(item=>{
	let mod = require("./modules/" + path.join(item)).default
	let modName = item.replace(/\.\/(.*)\/.*\w+$/,"$1")
	modules[modName] = mod
})

let openId = localStorage.getItem("openid") || ""
export default new Vuex.Store({
	state: {
		requestCount:0,
		openId,
	},
	getters: {
		loading(state){
			return state.requestCount == 0 ? false : true
		}
	},
	mutations: {
		setRequestCount(state,num){
			state.requestCount += num
		},
		setOpenId(state,openId){
			state.openId = openId
		}
	},
	actions: {
		changeLoading(context,bool){
			bool?context.commit("setRequestCount",1):context.commit("setRequestCount",-1)
		}
	},
	modules,
})
