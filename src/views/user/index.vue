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
				<img :src="data.data.row.avatarUrl" alt="" style="width:30px;height:30px">

			</template>
        </page-table>
    </div>
</template>
<script>
import pageTable from "@/components/page-table.vue"
import options from "./index"
import {mapState} from "vuex"
export default {
	name:"user",
	components:{
		pageTable
	},
	data(){
		return {
			columns:[],
			reqOptions:{},
			search:{},
			opration:{},
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
		//     opration:options.opration
	}
}
</script>