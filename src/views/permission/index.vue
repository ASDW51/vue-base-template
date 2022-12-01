<template>
    <div>
        <page-table  ref="pageTable" :func="func" :props='{
            "row-key":"id",
        }'>
            <template v-slot:icon="scope">
                <i :class="scope.data.row.icon" style="font-size:18px"></i>
            </template>
             <template v-slot:type="scope">
                <el-tag v-if="scope.data.row.type==0" type="warning" effect="light">目录</el-tag>
                <el-tag v-else-if="scope.data.row.type==1" effect="light">页面</el-tag>
                <el-tag v-else-if="scope.data.row.type==2" type="danger" effect="light">按钮</el-tag>
            </template>
            <template slot="test">tests</template>

            <template v-slot:formIcon="scope">
                <!-- <div v-show="false">{{changeIcon(scope.data)}}</div> -->
                <e-icon-picker :options="options" :value="scope.data" @change="changeIcon" style="width:200px"/>
            </template>
        </page-table>
    </div>
</template>
<script>
import pageTable from "@/components/page-table.vue"
import func from "./index.js"
export default {
	name:"permission",
	components:{
		pageTable,
	},
	data(){
		return {
			func,
			icon:"",
			options:{
				FontAwesome: false,
				ElementUI: true,
				eIcon: false,//自带的图标，来自阿里妈妈
				eIconSymbol: false,//是否开启彩色图标
				addIconList: [],
				removeIconList: [],
				zIndex: 3100
			}
		}
	},
	methods:{
		async changeIcon(e){
			console.log(e)
			let ptable = this.$refs.pageTable
			console.log(ptable.updateField)
			let updateField  =await ptable.updateFieldMethod({...ptable.updateField.form,icon:e})
			ptable.updateField = updateField
			console.log("icon变化",this.$refs.pageTable,updateField)
		},
	},
	mounted(){
		console.log(this.$refs)
	},
}
</script>
<style lang="css" scoped>
@import '~e-icon-picker/lib/index.css';
@import '~element-ui/lib/theme-chalk/icon.css';
</style>