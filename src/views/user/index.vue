<template>
    <div>
        <page-table 
        ref="pageTable"
        :func="options"
        @search="searchs"
        >
        
        </page-table>
    </div>
</template>
<script>
import pageTable from "@/components/page-table.vue"
import options from "./index"
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
		}
	},
	created(){

		//  columns:options.columns,
		//     reqOptions:options.reqOptions,
		//     search:options.search,
		//     opration:options.opration
	}
}
</script>