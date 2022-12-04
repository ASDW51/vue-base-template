import { uploadModeType } from "@/config/upload"


//地址转换
export const getFilePath = (base)=>{
	for(let i in uploadModeType){
		base = base.replace(uploadModeType[i].tag,uploadModeType[i].target)
	}
	return base
}