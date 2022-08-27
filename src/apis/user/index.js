import { post } from "@/requests"
import {get} from "@/requests"
export function login(data){
	return post("/mini/login",data)
}

export function menu(){
	return get("/menu")
}