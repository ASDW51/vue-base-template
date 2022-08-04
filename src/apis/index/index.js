import request from "@/requests/index"
const  getIndex = ()=>{
	return request.get("/test",{cancelLoading:false})
}
export default {getIndex}

export {
	getIndex
}