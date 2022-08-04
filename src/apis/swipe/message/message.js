import request from "@/requests/index"
const getMessage = ()=>{
	return request.get("/swipe")
}
export default {
	getMessage
}