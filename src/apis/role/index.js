import { get, post } from "@/requests/index"

export function roleList(){
	return get("/role/all")
}
export function rolePermission(data={}){
	return get("/role/permission",data)
}
export function savePermission(data={}){
	return post("/role/permission",data)
}