import store from "@/store"

export default {
	inserted(el,binding){
		let permission = binding.value
		if(!permission)return
		let userPermission = store.state.permission
		let show = false
		console.log(permission)
		if(typeof permission == "string"){
			// 字符
			console.log("指令传入字符", permission)
			show = userPermission.includes(permission)
		}
		if(permission instanceof Array){
			console.log("指令传入数组", permission)
			show = permission.every(item=>{
				return userPermission.includes(item)
			})
		}
		console.log("指令结果",show,userPermission,permission,el)
		if(!show){
			el.parentNode.removeChild(el)
		}
	}
}