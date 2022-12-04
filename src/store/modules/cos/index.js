export default {
    namespaced:true,
	state:{
		credentials:null
	},
    mutations:{
        setCredentials(state,payload){
            state.credentials = payload
        }
    },
    actions:{
        setCredentials(context,payload){
            context.commit("setCredentials",payload)
        }
    }
}