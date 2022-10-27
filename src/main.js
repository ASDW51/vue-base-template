import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import permission from "./directive/permission"
import {Plugin} from "vue-fragment"

//验证汉化
import "@/util/validate-zhCn"
// css
import "nprogress/nprogress.css"

import { 
	Button, 
	Select,
	Container,
	Header,
	Aside,
	Main,
	Footer,
	Menu,
	Submenu,
	MenuItem,
	Tabs,
	TabPane,
	Tooltip,
	Loading,
	Form,
	FormItem,
	Input,
	Table,
	TableColumn,
	DatePicker,
	Option,
	Dialog,
	Upload,
	Tag,
	Switch,
	Pagination,
	MessageBox,
	Message,
	Notification
} from "element-ui"
import eIconPicker from 'e-icon-picker';
//导入开启mock
if(process.env.NODE_ENV == "mock"){
	console.log("引入")
	import("@/mock/mock")
}


Vue.component(Button.name, Button)
Vue.component(Select.name, Select)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Upload)
Vue.use(Tag)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.config.productionTip = false
Vue.directive("permission",permission)
Vue.use(eIconPicker,{
	zIndex:3100
})
// 挂载所有api到Vue.$request上
// Vue.use(api)
Vue.use(Plugin)
new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app")
