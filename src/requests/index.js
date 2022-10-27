import axios from "axios"
import store from "../store/index"
import router from "@/router"
import { error, success, warning } from "@/util/notice"
const instance = axios.create({
	baseURL:process.env.VUE_APP_REQUEST_URL,
	timeout:0,
	headers:{
		"Content-Type":"application/json"
	}
})
// const errCode = [200,201,203,204]
const alertMessageCode = [201,202,203,204,205,401,403,404,500,501]
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
	if(alertMessageCode.includes(response.data.code)){
		if(response.data.code == 201 && response.data.data==false){
			warning(response.data.message)
		}else if(response.data.code < 300){
			success(response.data.message)
		}else if(response.data.code >= 400){
			error(response.data.message)
		}
	}
	// 失败的状态码

	if(response.data.code == 401){
		localStorage.removeItem("token")
		router.push("/login")
		return Promise.reject(response.data)	
	}
	return response.data
},err=>{
	// 处理错误
	if(!err.config.cancelLoading){
		store.dispatch("changeLoading",false)
	}
	error(err.message)
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