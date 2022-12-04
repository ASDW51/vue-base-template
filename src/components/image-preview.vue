<template>
    <div>
        <img :src="previewSrc" alt="" style="width:50px;height:50px">
    </div>
</template>
<script>
import { uploadModeType } from '@/config/upload';
export default {
	name:"ImagePreview",
	props:{
		src:String,
	},
	computed:{
		previewSrc(){
			let base = this.src
			for(let i in uploadModeType){
				base = base.replace(uploadModeType[i].tag,uploadModeType[i].target)
			}
			console.log("base",base)
			return base
		}
	}
}
</script>
