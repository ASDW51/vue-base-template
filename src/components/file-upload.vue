<template>
    <el-upload 
		ref="upload"
        :action="action"
        :headers="headers"
        :multiple="multiple"
        :on-success="success"
		:before-upload="beforeUpload"
        class="avatar-uploader"
        :data="{
            'type':actionType
        }"
        v-on="$listeners"
        >
            <i  class="el-icon-plus avatar-uploader-icon"></i>

    </el-upload>
</template>
<script>
import bus from "@/util/bus"
import {uploadMode,uploadModeType} from "@/config/upload"
export default {
	props:{
		actionType:{
			type:String,
			default:"images/avatar"
		},
		multiple:{
			type:Boolean,
			default:false,
		},
		fileType:{
			type:String,
			default:"image",
		},
		imageField:{
			type:String,
			default:"none"
		},
		saveMode:{
			type:String,
			default:uploadMode
		}
	},
	data(){
		let that = this
		return {
			headers:{
				token:localStorage.getItem("token")
			},
			beforeUpload:null,
			success: function(response,file) {
				// 控制只有一个文件
				if(!this.multiple){
					this.clearFiles()
					this.uploadFiles = [file]
				}
				console.log(bus)

				bus.$emit("updateData",{[that.imageField]:response})
			}
		}
	},
	created(){
		this.beforeUpload = (file)=>{
			console.log("终止合约",file)
			console.log(uploadModeType,uploadMode)
			let currentMode = uploadModeType[this.saveMode]
			currentMode.upload(this.action,file,{key:"type",value:this.actionType}).then(response=>{
				console.log("sc",response)
				// 控制只有一个文件
				if(!this.multiple){
					this.$refs.upload.clearFiles()
					this.$refs.upload.uploadFiles = [file]
				}
				response = response.replace(currentMode.target,currentMode.tag)
				console.log(response)
				bus.$emit("updateData",{[this.imageField]:response})
			})
			return false
		}
	},
	computed:{
		action(){
			return process.env.VUE_APP_UPLOAD_URL + "/" + this.fileType
		}
	}
}
</script>

<style scoped>
.avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
</style>