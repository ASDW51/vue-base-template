import Mock from "mockjs"
function paramsCheck(body, apibody){
    let err = ""
    let res = apibody.every(item => {
        if (!body[item.field]) {
            err += `缺少参数:${item.field}`
        } else if (typeof body[item.field] != item.type) {
            err += `参数 ${item.field} 预期的类型为:${item.type},接收的参数类型为${typeof body[item.field]}`
        }
        return !err
    })
    return res ? res : err
}
function regUrl(url) {
    let r = RegExp(url+"\\??" + ".*?")
    console.log(r)
    return r
}
function getUrlParams(url) {
	let urlStr = url.split("?")[1]
    let params = {}
    if(!urlStr) return params
	let paramsArr = urlStr.split("&")
   
    paramsArr.forEach(item=>{
        let arr = item.split("=")
        params[arr[0]] = arr[1]
    }) 
    return params
}
Mock.mock("/api/h5/billDetailList","get",(options)=>{
    console.log("mock--/api/h5/billDetailList", options)
    let body = JSON.parse(options.body)
    let get = getUrlParams(options.url)
    let err = paramsCheck({...body,...get},[])
    if(typeof err == "boolean"){
        return Mock.mock({"code":200,"message":"请求成功","data":{"pages":1,"total":2,"pageNum":1,"pageSize":10,"list|2":[{"id|1-100":1,"billNo":"XXYX170231091516693034372665","activeDate":"2023-12-11","status":"未支付","shopName":"人民公社精品东北菜（总部基地店）","salesName":"吴销售","platform":"美团外卖","orderNum|1-10":8,"orderMoney|100-1000":160}]},"timestamp":1702444022788})
    }else{
        throw new Error(err)
    }
})

console.log("setup")

Mock.setup({timeout:300})