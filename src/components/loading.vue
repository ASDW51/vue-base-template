<template>
    <van-overlay :show="loading" class-name="bgo">
		<div class="wrapper" @click.stop>
			<van-loading type="spinner" />
		</div>
	</van-overlay>
</template>
<script>
import {mapGetters} from "vuex"
export default {
	name:"GLoading",
	computed:{
		...mapGetters([
			"loading"
		])
	}
}
</script>
<style lang="less" scoped>
.wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
</style>
<style>
.bgo{
    background-color: rgba(0,0,0,0.0) !important;
}
</style>