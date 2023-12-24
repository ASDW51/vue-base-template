<template>
  <div id="app">
    <router-view />
	<g-loading />
  </div>
</template>
<script>
import GLoading from "./components/loading.vue"
export default{
	components:{
		GLoading
	}
}
</script>
<style lang="less">
@import "./assets/font.less";
body{
  height: 100vh;
  margin: 0;
}
#app{
  height: 100%;
}
</style>
