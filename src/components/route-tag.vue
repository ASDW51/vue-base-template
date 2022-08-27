<template>
    <div :class="isActive?'active default':'default unactive'" :style="slen" @click="jump">
        <div class="cir"></div>
        <div class="text">
            {{label}}
        </div>
        <div class="show" @click.stop="close" v-if="canClose">
            <i class="el-icon-close"></i>
        </div>
    </div>
</template>
<script>
/*
1.两种状态
2.hover长度可变
*/
export default {
	name:"route-tag",
	props:{
		isActive:{
			type:Boolean,
			default:false
		},
		label:{
			type:String,
			default:"label未定义"
		},
		path:{
			type:String,
			default:"/"
		},
		canClose:{
			type:Boolean,
			default:true
		}
	},
	methods:{
		chartLen(str){
			
		},
		jump(){
			this.$emit("click",this.path)
		},
		close(){
			this.$emit("close",this.path)
		}
	},
	computed:{
		slen(){
			let len = 0
			for(let i=0;i<this.label.length;i++){
				console.log(this.label[i].charCodeAt())
				if(this.label[i].charCodeAt()>255){
					len +=1
				}else{
					len +=0.5
				}
			}
			console.log("计算")
			return "--count:"+ (14*len+44)+"px"
		}
	}
}
</script>
<style scoped lang="less">
.default{
    margin-right: 10px;
    cursor: pointer;
    font-size: 14px;
    width: var(--count);
    transition: all .2s;
    align-items: center;
    display: flex;
    padding: 5px 10px;
    justify-content: center;
    .text{
        white-space: nowrap;
        margin-right: 7px;
    }
    .cir{
        opacity: 0;
        border-radius: 50%;
        background: white;
        width: 10px;
        height: 10px;
        margin-right: 4px;
    }
}
.unactive{
    border: 1px solid #d8dce5;
    justify-content: flex-start;
    color: #495060;
   
}
.active{
    background-color: #42b983;
    color: #FFF;
    .cir{
        opacity: 1;
    }
}
.show{
    display: block;
    i{
        border-radius: 50%;
    }

}
.unactive:hover{
    .show{
        display: block;
    }
    .show:hover i{
        background-color: rgba(0, 0, 0, .1);
    }
}
.active .show:hover i{
    color: #eee;
     background-color: rgba(255, 255, 255, .5);
}
</style>