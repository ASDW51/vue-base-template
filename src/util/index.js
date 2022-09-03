import {debounce as d} from "lodash-es"
import {throttle as t} from "lodash-es"
const debounce = (wait=400)=>{
	return (target,name,descriptor)=>{
		descriptor.value = d(descriptor.value,wait)
	}
}
const throttle = (wait,options)=>{
	return (target,name,descriptor)=>{
		descriptor.value = t(descriptor.value,wait,options)
	}
}
const dynamicRouter = (rotues,arr)=>{
	rotues.forEach(item=>{
		if(item.type==1){
			arr.push({
				path:item.path,
				name:item.cname,
				cpath:item.cpath,
				meta:{
					addtab:Boolean(item.addtab),
					text:item.cname,
					permission:item.perms,
					keep:item.keep==1?true:false
				}
			})
		}
		item.children && item.children.length > 0?dynamicRouter(item.children,arr):""
	})
}
const loadView = (view)=>{
	return  (resolve) => require([`@/views/${view}`], resolve)
}
export {
	debounce,
	throttle,
	dynamicRouter,
	loadView
}