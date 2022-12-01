<template>
    <div class="page-container">
        <div>
            <json-form 
                :direction="search.direction"
                :form="search.form"
                :labelPosition="search.labelPosition"
                ref="search"
                :options="search.options">
				<template :slot="item.slot" v-for="item in searchSlots">
					<slot :name="item.slot"></slot>
				</template>
			</json-form>
        </div>
        <div>
            <json-form
                :direction="operation.direction"
                :form="operation.form"
                ref="operation"
                :options="operation.options">
				<template :slot="item.slot" v-for="item in operationSlots">
					<slot :name="item.slot"></slot>
				</template>
			</json-form>
        </div>
        <div>
            <el-table 
                border 
                :data="tableData"
				:height="tableHeight"
                header-row-class-name="cust-head"
                header-cell-class-name="cust-head-cell"
				v-bind="props"
                >
                <el-table-column 
                    v-for="item in columns" 
                    :key="item.key" 
                    :prop="item.key" 
                    :label="item.label" 
                    :width="item.width"
                    :align="item.align?item.align:'center'"
                    >
                    <template slot-scope="scope">
                            <div v-if="item.slot=='operation'">
								<slot name="moreoperation" :data="scope"></slot>
                                <el-button type="primary" v-if="item?.editBtn?.show"  v-permission="item?.editBtn?.permission" size="small" @click="edit(scope.row)">编辑</el-button>
                                <el-button type="danger" v-if="item?.removeBtn?.show" v-permission="item?.removeBtn?.permission" size="small" @click="delUser(scope.row)">删除</el-button>
							</div>
							<slot :name="item.slot" v-else-if="item.slot" v-bind:data="scope"></slot>
							<template v-else>
								{{scope.row[item.key]}}
							</template>
                    </template>
                    
                </el-table-column>
            </el-table>
        </div>
		<div style="text-align:right;margin-top:10px;">
			<el-pagination
				background
				layout="total,sizes,prev,pager,next"
				:page-size="pageSize"
				:page-sizes="[10,20,50,100]"
				:total="pageTotal"
				:current-page="pageNum"
				@next-click="page(1)"
				@prev-click="page(-1)"
				@current-change="pageChange"
				@size-change="sizeChange"
				></el-pagination>
		</div>
        <div>
            <el-dialog :title="mode=='add'?'新增':'修改'" v-model="show" :visible.sync="show">

                <json-form
                    :direction="updateField.direction"
                    :form="updateField.form"
                    ref="updateForm"
                    :options="updateField.options">
					<template :slot="item.slot" v-for="item in updateFiledSlots" slot-scope="scope">
						<slot :name="item.slot" :data="scope.data"></slot>
					</template>
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
import bus from "@/util/bus"
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
		custComp:{},
		props:{
			type:Object,
			default:()=>({})
		}
	},
	components:{
		jsonForm
	},
	data(){
		return {
			columns:[],
			reqOptions:{},
			search:{},
			operation:{},
			tableData:[],
			show:false,
			updateField:{},
			pageTotal:1,
			pageSize:10,
			pageNum:1,
			tableHeight:350,
			mode:"add",
		}
	},
	async created(){
		let options = await this.func(this)
		this.columns = options.columns || []
		this.reqOptions = options.reqOptions || {}
		this.search = options.search || {}
		this.operation = options.operation || {}
		this.updateFieldMethod = options.updateField || (()=>{})
		this.addFieldMethod = options.addField || options.updateField || (()=>{})
		this.getList()
	},
	methods:{
		getList(){
			let params = {
				pageNum:this.pageNum,
				pageSize:this.pageSize,
				...this.search.form
			}
			let list = this.reqOptions.list
			if(!list){
				throw new Error("未配置reqOptions.list")
			}
			console.log([list.method])
			request[list.method](list.url,{params}).then(res=>{
				this.tableData = res.data.list
				this.pageTotal = res.data.total
				list.callback && list.callback(this,res)
				if(res.data.pages < this.pageNum){
					this.pageNum = res.data.pages
					this.getList()
				}
				
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
			this.updateField =await this.addFieldMethod()
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
		addForm(res){
			let insert = this.reqOptions.insert
			if(!insert){
				throw new Error("未配置reqOptions.insert")
			}
			request[insert.method](insert.url,res).then(res=>{
				console.log("插入---",res)
				if(res.data){
					this.show = false
					this.getList()
				}
				
			})
		},
		updateForm(res){
			let update = this.reqOptions.update
			if(!update){
				throw new Error("未配置reqOptions.update")
			}
			request[update.method](update.url,res).then(res=>{
				if(res.data){
					this.show = false
					this.getList()
				}
			})
		},
		dialogConfirm(){
			console.log("提交")
			this.$refs.updateForm.submit((res)=>{
				console.log("提交",res)
				//
				if(this.mode == "add"){
					this.addForm(res)
				}else{
					this.updateForm(res)
				}
			})
		},
		async delUser(row){
			this.$confirm("确定删除吗？","删除",{
				confirmButtonText:"确定",
				cancelButtonText:"取消",
				type:"warning"
			}).then(()=>{
				console.log(row.id)
				let remove = this.reqOptions.remove
				if(!remove){
					throw new Error("未配置reqOptions.remove")
				}
				request[remove.method](remove.url.replace("${id}",row.id)).then(res=>{
					console.log(res)
					this.getList()
				})
			})
			
		},
		page(num){
			console.log("page")
			if(this.pageNum+num <= this.pageTotal && this.pageNum+num != 0){
				this.pageNum += num
				this.getList()
			}
		},
		pageChange(num){
			this.pageNum = num
			this.getList()
		},
		sizeChange(num){
			this.pageSize = num
			this.pageNum = 1
			this.getList()
		},
		resize(){
			// 计算el-table的最大高度
			setTimeout(()=>{
				console.log("debugger")
				this.tableHeight = window.innerHeight - 80 - this.$refs.search.$el.clientHeight - this.$refs.operation.$el.clientHeight -42 -42
			})
		},
		async updateData(form={}){
			let tform = this.updateField.form
			let formKeys = Object.keys(form)
			if(formKeys.some(item=>tform[item]) || Object.keys(tform).length == 0 || this.mode == "add"){
				console.log("update",this.updateField,this.$parent)
				this.updateField =await this.updateFieldMethod({...this.updateField.form,...form})
			}else{
				console.log("不更新")
			}
			
		}
	},

	mounted(){
		console.log(this.$refs.search)
		this.resize()
		window.addEventListener("resize",this.resize)
		bus.$on("updateData",this.updateData)
	},
	beforeDestroy(){
		window.removeEventListener("resize",this.resize)
		bus.$off("updateData",this.updateData)
	},
	computed:{
		// 计算search 插槽
		searchSlots(){
			return this.search?.options?.filter(item=>item.slot)
		},
		//operation 插槽
		operationSlots(){
			return this.operation?.options?.filter(item=>item.slot)
		},
		updateFiledSlots(){
			return this.updateField?.options?.filter(item=>item.slot)
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