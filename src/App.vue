<template>
  <div id="app">
    <router-view />
    <loading />
  </div>
</template>
<script>
import loading from "@/components/loading.vue"
export default {
	name:"App",
	components:{
		loading
	}
}
</script>
<style lang="less">
body{
  height: 100vh;
  margin: 0;
}
#app{
  height: 100%;
}
</style>
