import request from "@/requests/index"
const getSwipeDetail = ()=>{
	return request.get("/swipe")
}
export default {
	getSwipeDetail
}