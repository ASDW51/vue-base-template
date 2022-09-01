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
				:height="tableHeight"
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
								<slot name="moreOpration" :data="scope"></slot>
                                <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" @click="delUser(scope.row)">删除</el-button>
                        </div>
                        <slot :name="item.slot" v-else-if="item.slot" v-bind:data="scope"></slot>
                        <div v-else>
                            {{scope.row[item.key]}}
                        </div>
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
			updateField:{},
			pageTotal:1,
			pageSize:10,
			pageNum:1,
			tableHeight:350,
			mode:'add',
		}
	},
	async created(){
		let options = await this.func(this)
		this.columns = options.columns
		this.columns = options.columns
		this.reqOptions = options.reqOptions
		this.search = options.search
		this.opration = options.opration
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
				return
			}
			console.log([list.method])
			request[list.method](list.url,{params}).then(res=>{
				this.tableData = res.data.list
				this.pageTotal = res.data.total
				list.callback && list.callback(this,res)
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
				if(this.mode == 'add'){
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
			}).then(res=>{
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
				this.tableHeight = window.innerHeight - 80 - this.$refs.search.$el.clientHeight - this.$refs.opration.$el.clientHeight -42 -42
			})
		}
	},

	mounted(){
		console.log(this.$refs.search)
		this.resize()
		window.addEventListener("resize",this.resize)
	},
	beforeDestroy(){
		window.removeEventListener("resize",this.resize)
	},
	computed:{
		caclColumns(){
			// 鉴权
			if(false){
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