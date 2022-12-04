import { post,get } from "@/requests/index"
import store from "@/store";
import bus from "@/util/bus";
import cos from "./cos";
export const uploadFile = (url,file,...other)=>{
    const formData = new FormData();
    formData.append("file",file);
    for(let i in other){
        formData.append(other[i].key,other[i].value)
    }
    return new Promise((resolve,reject)=>{
        post(url,formData,{
            'Content-type':"multipart/form-data "
        }).then(res=>{
            resolve(process.env.VUE_APP_REQUEST_URL+res)
        }).catch(err=>{
            reject(err)
        })
    })
}

export const uploadBucket=(url,file)=>{
    return new Promise((resolve,reject)=>{
        cos.uploadFile({
            Bucket:"iiweb-1305134676",
            Region:"ap-guangzhou",
            Key:process.env.NODE_ENV+'/'+file.name,
            Body:file,
            onProgress: function(progressData) {
                console.log(JSON.stringify(progressData));
            }
        },function(err,data){
            if (err) {
                console.log('上传失败', err,data);
                // 上传失败可能是临时密钥过期了，清空store中保存的密钥
                store.dispatch("cos/setCredentials",null)
                bus.$message.error("未知错误，请重试")
                reject(err)
            } else {
                console.log('上传成功', data);
                resolve("https://"+data.Location)
            }
        })
    })
}

export const getCredential = _=>{
    return get("/cos/credential")
}