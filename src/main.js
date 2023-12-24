import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import api from "@/apis/index"
import "@/config/vant"
import usePage from "./util/usePage.js"
import {getFilePath} from "./filters/index"
import VueClipboard from "vue-clipboard2"


//导入开启mock
if(process.env.NODE_ENV == "mock"){
	console.log("mock mode")
	import("@/mock/mock")
}
// 适配移动端
import "lib-flexible/flexible"
Vue.config.productionTip = false
Vue.use(usePage)
Vue.filter("getFilePath",getFilePath)
//复制到剪切板
Vue.use(VueClipboard)
// 挂载所有api到Vue.$request上
Vue.use(api)
new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app")
