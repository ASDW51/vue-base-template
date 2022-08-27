<template>
    <div class="page-container">
        <div>
            <json-form 
                :direction="search.direction"
                :form="search.form"
                :labelPosition="search.labelPosition"
                ref="search"
                :options="search.options"></json-form>
        </div>
        <div>
            <json-form
                :direction="opration.direction"
                :form="opration.form"
                ref="opration"
                :options="opration.options"></json-form>
        </div>
        <div>
            <el-table 
                border 
                :data="tableData"
                header-row-class-name="cust-head"
                header-cell-class-name="cust-head-cell"
                >
                <el-table-column 
                    v-for="item in caclColumns" 
                    :key="item.key" 
                    :prop="item.key" 
                    :label="item.label" 
                    :width="item.width"
                    align="center"
                    >
                    <template slot-scope="scope">
                            <div v-if="item.slot=='opration'">
                                <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                                <el-button type="danger" size="small">删除</el-button>
                        </div>
                        <slot :name="item.slot" v-else-if="item.slot" v-bind:data="scope"></slot>
                        <div v-else>
                            {{scope.row[item.key]}}
                        </div>
                    </template>
                    
                </el-table-column>
            </el-table>
        </div>
        <div>
            <el-dialog v-model="show" :visible.sync="show">
                <json-form
                    :direction="updateField.direction"
                    :form="updateField.form"
                    ref="updateForm"
                    :options="updateField.options">
                </json-form>
                <span slot="footer">
                    <el-button @click="show=false">取消</el-button>
                    <el-button type="primary" @click="dialogConfirm">确认</el-button>
                </span>
            </el-dialog>
            <!-- <component v-else :is="customComp && show" :data="updateField">

            </component> -->
        </div>
    </div>
</template>
<script>
import request from "@/requests"
import jsonForm from "./json-form.vue"
export default {
	name:"page-table",
	props:{
		func:{
			type:Function,
			default:()=>{}
		},
		autosearch:{
			type:Boolean,
			default:true,
		},
		custComp:{}
	},
	components:{
		jsonForm
	},
	data(){
		return {
			columns:[],
			reqOptions:{},
			search:{},
			opration:{},
			tableData:[],
			show:false,
			updateField:{}
		}
	},
	methods:{
		getList(data={}){
			let list = this.reqOptions.list
			if(!list)return
			console.log([list.method])
			request[list.method](list.url,data).then(res=>{
				this.tableData = res.data
			})
		},
		searchFun(...e){
			console.log(e)
			console.log(this)
			this.$refs.search.submit((form)=>{
				console.log("验证成功",form)
			})
		},
		async addFun(){
			this.updateField =await this.updateFieldMethod()
			this.show = true
			this.mode = "add"
            
		},
		async edit(row){
			this.updateField =await this.updateFieldMethod()
			console.log(row)
			this.updateField.form = row
			this.show = true
			this.mode = "edit"
		},
		dialogConfirm(){
			console.log("提交")
			this.$refs.updateForm.submit((res)=>{
				console.log("提交",res)
			})
		}
	},
	async created(){
		let options = await this.func(this)
		this.columns = options.columns
		this.columns = options.columns
		this.reqOptions = options.reqOptions
		this.search = options.search
		this.opration = options.opration
		this.updateFieldMethod = options.updateField || {}
		this.getList()
	},
	computed:{
		caclColumns(){
			// 鉴权
			if(true){
				let opration = [
					{
						key:"opration",
						label:"操作",
						slot:"opration"
					}
				]
				return [...this.columns,...opration]
			}else{
				return this.columns
			}
		}
	}
}
</script>
<style scoped lang="less">
/deep/ .cust-head{
    .cust-head-cell{
    background-color: #F2F6FC;

    }
}
.page-container{
    display: flex;
    flex-direction: column;
}
</style>