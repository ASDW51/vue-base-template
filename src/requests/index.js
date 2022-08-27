import axios from "axios"
import store from "../store/index"
import Vue from "vue"
const instance = axios.create({
	baseURL:process.env.NODE_ENV=="production"?process.env.VUE_APP_REQUEST_URL:"https://abcde.loca.lt/client",
	timeout:0,
	headers:{
		"Content-Type":"application/json"
	}
})
const successCode = [200,201,203,204]
// 前置拦截器
instance.interceptors.request.use(config=>{
	// 携带token
	config.headers.token = localStorage.getItem("token")
	//开启loading--canceLoading 为false
	if(!config.cancelLoading){
		store.dispatch("changeLoading",true)
	}
	return config
})

//后置拦截器
instance.interceptors.response.use(response=>{
	if(!response.config.cancelLoading){
		store.dispatch("changeLoading",false)
	}
	console.log("response",response.data)
	if(!(successCode.includes(response.data.code))){
		console.log("状态码",response.data.code)
		new Vue().$message.warning(response.data.message)
		if(response.data.code == 401){
			localStorage.removeItem("token")
		}
		return Promise.reject(response.data)
	}
	return response.data
},err=>{
	// 处理错误
	if(!err.config.cancelLoading){
		store.dispatch("changeLoading",false)
	}
	new Vue().$message.error(err.message)
	console.log(err)
	//需要返回reject 不然错误的时候实例请求还是会走resolve
	return Promise.reject(err)

})
const get = (url,data,config={})=>{
	return instance.get(url,{
		params:data,
		...config
	})
}
const post = (url,data,config)=>{
	return instance.post(url,data,config)
}
const put = (url,data,config)=>{
	return instance.put(url,data,config)
}
const del = (url,config)=>{
	return instance.delete(url,config)
}
export default instance

export {
	instance,
	get,
	del,
	post,
	put
}