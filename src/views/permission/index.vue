<template>
    <div>
        <page-table :func="func" :props='{
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
            <template slot="test">test</template>
            <template slot="menuType">
                ss
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
			func
		}
	}
}
</script>