import Cos from "cos-js-sdk-v5"
import { getCredential } from "./index"
import store from "@/store"
export const refreshStoreCredent =async _=>{
    let {data} = await getCredential()
    console.log("r",data.credentials)
    let res ={
        TmpSecretId: data.credentials.tmpSecretId,
        TmpSecretKey: data.credentials.tmpSecretKey,
        SecurityToken: data.credentials.sessionToken,
        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
        ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
    }
    store.dispatch("cos/setCredentials",res)
    return res 
}

export default new Cos({
    getAuthorization:async function(option,callback){
        let credentials = store.state.cos.credentials
        // let credentials = null
        if(!credentials){
            credentials = await refreshStoreCredent()
        }
        console.log("获取到cred",credentials)
        callback({
            TmpSecretId: credentials.TmpSecretId,
            TmpSecretKey: credentials.TmpSecretKey,
            SecurityToken: credentials.SecurityToken,
            // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
            StartTime: credentials.StartTime, // 时间戳，单位秒，如：1580000000
            ExpiredTime: credentials.ExpiredTime, // 时间戳，单位秒，如：1580000000
        })
    }
})