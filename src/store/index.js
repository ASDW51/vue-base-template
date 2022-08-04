import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		requestCount:0
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
	},
	actions: {
		changeLoading(context,bool){
			bool?context.commit("setRequestCount",1):context.commit("setRequestCount",-1)
		}
	},
	modules: {},
})
