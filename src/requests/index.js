import axios from "axios"
import store from "../store/index"
const instance = axios.create({
    baseURL:process.env.NODE_ENV=='development'?'/':process.env.VUE_APP_REQUEST_URL,
    timeout:5000,
    headers:{
        "Content-Type":"application/json"
    }
})

// 前置拦截器
instance.interceptors.request.use(config=>{
    // 携带token
    config.headers.token = 'custom tocken'
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
    return response.data
},err=>{
    // 处理错误
    if(!err.config.cancelLoading){
        store.dispatch("changeLoading",false)
    }
    console.log(err)
    //需要返回reject 不然错误的时候实例请求还是会走resolve
    return Promise.reject(err)

})

export default instance