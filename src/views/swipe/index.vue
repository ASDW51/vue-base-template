<template>
    <div>
        <page-table :func="func"
        >
            <template slot="img" slot-scope="data">
                <image-preview :src="data.data.row.img"></image-preview>
            </template>
        </page-table>

    </div>
</template>
<script>
import pageTable from "@/components/page-table.vue"
import ImagePreview from "@/components/image-preview.vue"
import func from "./index.js"
export default {
	name:"swipe",
	components:{
		pageTable,
		ImagePreview
	},
	data(){
		return {
			func
		}
	}
}
</script>