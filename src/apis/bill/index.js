import {get,post} from "@/requests/index"
const getBillDetail = (query)=>{
	return get("/billDetailList",query)
}
const getQrcode = ()=>{
	return get("/code")
}
const getBillInfo = (data)=>{
	return get("/billDetail",data)
}
const getOpenId = (data)=>{
	return get("/code2Token",data)
}
const genPreOrder = (data)=>{
	return post("/preOrder",data)
}
export default {
	getBillDetail,
	getQrcode,
	getBillInfo,
	getOpenId,
	genPreOrder
}