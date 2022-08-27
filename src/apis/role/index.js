import { get } from "@/requests/index"

export function roleList(){
	return get("/role")
}