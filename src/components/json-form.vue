<template>
    <div>
        <el-form :model="form" :label-width="labelWidth+'px'" :rules="rules" ref="form" :label-position="labelPosition" :inline="direction=='h'">
            <el-form-item 
                v-for="item in options" 
                :key="item.key"
                :prop="item.key"
                :label="item.removeLabel?'':item.label"
                >
                <slot v-if="item.slot" :name="item.slot"></slot>
                <template v-else>
                    <component :is="item.type" v-model="form[item.key]" v-bind="item.props" v-on="item.listeners" :style="{width:item.width===false?'':(item.width || '200px')}">
                        
                        <template v-if="item.type == 'el-select'">
                            <el-option
                                v-for="(subitem,index) in item.options"
                                :key="index"
                                :value="subitem.value"
                                :label="subitem.label">
                                    {{subitem.label}}
                            </el-option>
                        </template>
                        <template v-else-if="item.type == 'el-button'">
                            {{item.label}}
                        </template>
                        <template v-else-if="item.type == 'el-upload'">
                              <i  class="el-icon-plus avatar-uploader-icon"></i>
                        </template>
                    </component>
                </template>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
	name:"json-form",
	props:{
		form:{
			type:Object,
			default:()=>({})
		},
		options:{
			type:Array,
			default:()=>[]
		},
		direction:{
			type:String,
			default:"v"
		},
		labelPosition:{
			type:String,
			default:"right"
		}
	},
	data(){
		return {
            
		}
	},
	methods:{
		submit(callback){
			this.$refs.form.validate(valid=>{
				if(valid){
					callback(this.form)
				}else{
					return false
				}
			})
		},
		charLen(str){
			let len = 0
			for(let i=0;i<str.length;i++){
				if(str[i].charCodeAt()>255){
					len +=1
				}else{
					len +=0.5
				}
			}
			return len
		}
	},
	computed:{
		rules(){
			let r = {}
			this.options.map((item)=>{
				r[item.key] = [
					{
						required:item.required?item.required:false,
						trigger:item.type=="el-input"?"blur":"change"},
					...(item.rules?item.rules:[])
				]
			})
			return r
		},
		labelWidth(){
			let charlen = this.options.map(item=>this.charLen(item.label))
			return Math.max(...charlen) * 20
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