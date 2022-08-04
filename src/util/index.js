import {debounce as d} from "lodash-es"
import {throttle as t} from "lodash-es"
const debounce = (wait=400)=>{
	return (target,name,descriptor)=>{
		console.log(descriptor.value)
		descriptor.value = d(descriptor.value,wait)
	}
}
const throttle = (wait,options)=>{
	return (target,name,descriptor)=>{
		descriptor.value = t(descriptor.value,wait,options)
	}
}
export {
	debounce,
	throttle,
}