import Vue from "vue"
import VueRouter from "vue-router"
import store from "@/store"
import  NProgress  from "nprogress"
import Index from "../views/Index.vue"
import { warning } from "@/util/notice"
Vue.use(VueRouter)
//路由白名单
let whiteList = ["/login"]
//自动注册路由
// let fileList = require.context("@/views",true,/\.vue$/)
// let dynamicRoute = fileList.keys().filter(item=>item!=="./Index.vue").map(item=>{
// 	let routePath = item.replace(/^\.\//,"").replace(/\.vue/,"")
// 	let routeName = routePath.replace(/\//g,"-")
// 	let routeLoadPath = ()=>import("@/views/"+path.join(item))
// 	console.log(routePath,routeName,routeLoadPath)
// 	return {
// 		path:routePath,
// 		name:routeName,
// 		component:routeLoadPath
// 	}
// })
const loadView = (view)=>{
	return  (resolve) => require([`@/views/${view}`], resolve)
}
const routes = [
	{
		path: "/",
		name: "home",
		component: Index,
		children:[		
		]
	},
	{
		path:"/login",
		name:"login",
		component:()=>import("@/views/login/index.vue")
	},
	{
		path:"/403",
		name:"forbidden",
		component:()=>import("@/views/403.vue")
	}
]

const router = new VueRouter({
	routes,
})

// 这个错误是vue-router内部错误,导致导航跳转问题,往同一地址跳转时会报错的情况push和replace 都会导致这个情况的发生。
// 解决方法：
// 在路由器router里面的index.js里面加上下面这段代码就没事了
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
//push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject)
		return originalPush.call(this, location, onResolve, onReject)
	return originalPush.call(this, location).catch(err => err)
}
//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
	if (onResolve || onReject)
		return originalReplace.call(this, location, onResolve, onReject)
	return originalReplace.call(this, location).catch(err => err)
}

// 
let addRouted = false
router.beforeEach(async (to,from,next)=>{
	NProgress.start()
	console.log(to)
	// 判断当前页面不是登录页且router不为空
	if(to.path != "/login" && store.state.routes.length != 0 && (!addRouted || store.state.menu.length==0)){
		if(store.state.menu.length==0 || store.state.role.length == 0){
			await store.dispatch("updateRouter")
		}
		let sroutes  = store.state.routes.map(item=>({...item,component:loadView(item.cpath)}))
		sroutes.forEach(item=>{
			router.addRoute("home",item)
		})
		console.log("生成的routes",router.getRoutes())
		addRouted = true
		next({
			...to,
			replace:true
		})
	}

	//验证是否有权限访问当前页面
	let pageNeedPerm = to.meta.permission
	if(pageNeedPerm){
		if(!store.state.permission.includes(pageNeedPerm)){
			warning("无权限访问该页面,请联系管理员")
			router.push("/403")
		}else{
			console.log("页面权限验证通过")
		}
	}


	if(whiteList.indexOf(to.path) !== -1)
	{
		// 白名单列表，无需验证
		next()
	}else{
		// 验证逻辑
		if(!localStorage.getItem("token")){
			router.push("/login")
		}

		next()
	}
})

router.afterEach((to)=>{
	// 维护一份页面栈(保存打开页面)
	let tab = {
		path:to.path,
		name:to.name,
		addtab:to.meta.addtab,
		text:to.meta.text
	}
	store.dispatch("addTabs",tab)
	NProgress.done()
})

export default router
