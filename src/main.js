import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from "@/apis/index"
//导入开启mock
if(process.env.NODE_ENV == 'mock'){
  import("@/mock/mock")
}
Vue.config.productionTip = false;
// 挂载所有api到Vue.$request上
Vue.use(api)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
