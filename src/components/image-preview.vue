<template>
    <div>
        <img :src="previewSrc" alt="" style="width:50px;height:50px">
    </div>
</template>
<script>
export default {
	name:"ImagePreview",
	props:{
		src:String,
	},
	computed:{
		previewSrc(){
			return process.env.VUE_APP_REQUEST_URL + this.src
		}
	}
}
</script>
