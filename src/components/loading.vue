<template>
    <div v-loading.fullscreen.lock="loading" element-loading-background="rgba(0,0,0,0)">

    </div>
</template>
<script>
import {mapGetters} from "vuex"
export default {
	name:"Loading",
	computed:{
		...mapGetters([
			"loading"
		])
	}
}
</script>