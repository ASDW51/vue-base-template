import Vue from "vue"
import Vuex from "vuex"
import router from "@/router/index"
import {menu} from "@/apis/user/index"
import {dynamicRouter} from "@/util/index"

const path = require("path")

Vue.use(Vuex)
//自动装载modules
const fileList = require.context("./modules",true,/\.js$/)
let modules = {}
fileList.keys().forEach(item=>{
	let mod = require("./modules/" + path.join(item)).default
	let modName = mod.name ||  item.replace(/\.\/(.*)\/.*\w+$/,"$1")
	modules[modName] = mod
})

// 读取router
let localRouter = localStorage.getItem("router")
localRouter = localRouter?JSON.parse(localRouter):[]
let localMenu = localStorage.getItem("menu")
localMenu = localMenu?JSON.parse(localMenu):[]
let localRole = localStorage.getItem("role")
localRole = localRole?JSON.parse(localRole):[]
let permission = localStorage.getItem("permission")
permission = permission?JSON.parse(permission):[]
export default new Vuex.Store({
	state: {
		requestCount:0,
		tabList:[
			{
				path:"/",
				text:"首页",
				close:false
			}
		],
		activeRouter:"/",
		routes:localRouter,
		menu:[],
		role:localRole,
		permission:permission
	},
	getters: {
		loading(state){
			return state.requestCount == 0 ? false : true
		},
		openPages(state){
			return state.tabList
		},
		activeRouter(state){
			return state.activeRouter
		}
	},
	mutations: {
		setRequestCount(state,num){
			state.requestCount += num
		},
		setTabs(state,tab){
			if(state.tabList.findIndex(item=>item.path == tab.path) == -1 && tab.addtab){
				console.log("不存在")
				state.tabList.push(tab)
			}
			state.activeRouter = tab.path
		},
		setARouter(state,path){
			state.activeRouter = path
		},
		removeTab(state,path){
			let index = state.tabList.findIndex(item=>item.path==path)
			console.log(index)
			state.tabList.splice(index,1)
			console.log(state.tabList)
			if(state.activeRouter == path){
				state.activeRouter = state.tabList[index-1].path
				router.push(state.tabList[index-1].path)
			}
			
		},
		setRouter(state,routes){
			state.routes = routes
		},
		addTreeMenu(state,menu){
			state.menu = menu
		},
		addRole(state,role){
			state.role = role
		},
		addPermission(state,permission){
			state.permission = permission
		}
	},
	actions: {
		changeLoading(context,bool){
			bool?context.commit("setRequestCount",1):context.commit("setRequestCount",-1)
		},
		addTabs(context,tab){
			context.commit("setTabs",tab)
		},
		setActiveRoute(context,path){
			context.commit("setARouter",path)
		},
		removeTab(context,path){
			context.commit("removeTab",path)
		},
		addRouter(context,routes){
			// 保存一份，设置路由
			context.commit("setRouter",routes)
			localStorage.setItem("router",JSON.stringify(routes))
		},
		addTreeMenu(context,menu){
			context.commit("addTreeMenu",menu)
			localStorage.setItem("menu",JSON.stringify(menu))
		},
		addRoleList(context,role){
			context.commit("addRole",role)
			localStorage.setItem("role",JSON.stringify(role))
		},
		addPermission(context,permission){
			context.commit("addPermission",permission)
			localStorage.setItem("permission",JSON.stringify(permission))

		},
		async updateRouter(context){
			return menu().then(res=>{
				console.log("获取到菜单")
				context.dispatch("addTreeMenu",res.data.menu)
				context.dispatch("addRoleList",res.data.role)
				let arr = []
				dynamicRouter(res.data.menu,arr)
				console.log(arr)
				context.dispatch("addRouter",arr)
			})
		}
	},
	modules,
})
