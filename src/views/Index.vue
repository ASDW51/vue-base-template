<template>
  <div class="hello">
    <button @click="request">请求测试</button>
    <router-view></router-view>
  </div>
</template>

<script>
import {debounce} from "@/util/index"
import {throttle} from "@/util/index"
debounce
import "@/apis/index"
export default {
	name: "Index",
	methods:{
	@throttle
		request(){
			this.$request.index.getIndex().then(res=>{
				console.log(res)
			})
			this.$request.swipe.getSwipe().then(res=>{
				console.log(res)
			})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
