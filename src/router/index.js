import path from "path-browserify"
import Vue from "vue"
import VueRouter from "vue-router"
import Index from "../views/Index.vue"

Vue.use(VueRouter)
//路由白名单
let whiteList = ["/","/about"]
//keepList = []
let keepList = ["Bill-index"]
//自动注册路由
let fileList = require.context("@/views",true,/\.vue$/)
let dynamicRoute = fileList.keys().filter(item=>item!=="./Index.vue").map(item=>{
	let routePath = item.replace(/^\.\//,"").replace(/\.vue/,"")
	let routeName = routePath.replace(/\//g,"-")
	let routeLoadPath = ()=>import("@/views/"+path.join(item))
	console.log(routePath,routeName,routeLoadPath)
	return {
		path:routePath,
		name:routeName,
		component:routeLoadPath,
		meta:{
			keep:keepList.includes(routeName)
		}
	}
})
const routes = [
	{
		path: "/",
		name: "home",
		component: Index,
		children:dynamicRoute
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


router.beforeEach((to,from,next)=>{
	console.log(to)
	if(whiteList.indexOf(to.path) !== -1)
	{
		// 白名单列表，无需验证
		next()
	}else{
		// 验证逻辑


		next()
	}
})


export default router
