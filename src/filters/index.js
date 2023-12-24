import { uploadModeType } from "@/config/upload"


//地址转换
export const getFilePath = (base="")=>{
	if(!base){
		return ""
	}
	for(let i in uploadModeType){
		// console.log(uploadModeType[i],uploadModeType[i].target,base)
		base = base.replace(uploadModeType[i].tag,uploadModeType[i].target)
	}

	return base
}