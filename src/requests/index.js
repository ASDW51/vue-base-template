import axios from "axios"
import store from "../store/index"
import { Toast } from "vant"
const instance = axios.create({
	baseURL:process.env.NODE_ENV=="production"?process.env.VUE_APP_REQUEST_URL:"/",
	timeout:5000,
	headers:{
		"Content-Type":"application/json"
	}
})
let rightCode = [200,201,202,203,204]
// 前置拦截器
instance.interceptors.request.use(config=>{
	// 携带token
	config.headers.token = "custom tocken"
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
	// console.log(response.data)
	if(rightCode.includes(response.data.code)){
		return response.data?.data
	}else{
		Toast.fail(response.data.message)
		return Promise.reject()
	}
},err=>{
	// 处理错误
	if(!err.config.cancelLoading){
		store.dispatch("changeLoading",false)
	}
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