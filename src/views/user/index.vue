<template>
    <div>
        <page-table 
        ref="pageTable"
        :func="options"
        @search="searchs"
        >
			<template v-slot:role="data">
				{{formatRole(data.data.row.roleId)}}
			</template>
			<template v-slot:avatar="data">
				<img :src="data.data.row.avatarUrl | getFilePath" alt="" style="width:30px;height:30px">

			</template>
        </page-table>
    </div>
</template>
<script>
import pageTable from "@/components/page-table.vue"
import options from "./index"
import {mapState} from "vuex"
import {getFilePath} from "@/util/index"
export default {
	name:"user",
	components:{
		pageTable
	},
	filters:{getFilePath},
	data(){
		return {
			columns:[],
			reqOptions:{},
			search:{},
			operation:{},
			options
		}
	},
	methods:{
		searchs(){
			console.log("点击搜索")
		},
		formatRole(id){
			let role = this.role.find(item=>item.id==id)
			if(role){
				return role.name
			}
			return ""
		}
	},
	computed:{
		...mapState(["role"])
	},
	created(){

		//  columns:options.columns,
		//     reqOptions:options.reqOptions,
		//     search:options.search,
		//     operation:options.operation
	}
}
</script>