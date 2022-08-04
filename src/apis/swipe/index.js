import request from "@/requests/index"
const getSwipe = ()=>{
	return request.get("/swipe")
}
export default {
	getSwipe
}