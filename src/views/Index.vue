<template>
  <div class="hello">
    <el-container style="height: 100%">
      <el-aside :width="!isOpen?'64px':'200px'" style="background-color: #304156;transition:width .3s;">
        <el-menu
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409eff"
		  @select="select"
		  router
		  :collapse="!isOpen"
		  style="border-right:none;"
		  :default-active="defaultActive"
        >
		  <menu-tree :menuData="menu"/>
        </el-menu>
		
      </el-aside>

      <el-container>
        <el-header class="header"> 
			<!-- menu cllapse , 面包屑 -->
			<div class="navbar">
				<div class="before">
					<div class="menu-close" @click="closeMenu">
						<i class="el-icon-s-fold" v-if="isOpen"></i>
						<i class="el-icon-s-unfold" v-if="!isOpen"></i>
					</div>
				</div>
				<div class="after">
					aa
				</div>
			</div>
			
			<div class="route-tag">
				<template v-for="(item) in openPages" :label="item.text" :name="item.path">
					<route-tag 
						:key="item.path" 
						:label="item.text" 
						:path="item.path"
						:isActive="activeRouter==item.path"
						:canClose="item.close"
						@click="go"
						@close="close"
						/>
				</template>
			</div>
		</el-header>

        <el-main>
		  <transition name="slide-left">
			<keep-alive>
				<router-view v-if="$route.meta.keep" class="child-view"></router-view>
			</keep-alive>
		  </transition>
			<router-view v-if="!$route.meta.keep" class="child-view"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import routeTag from "@/components/route-tag.vue"
import menuTree from "@/components/menu-tree.vue"
import {mapState} from "vuex"
export default {
	name: "Index",
	data(){
		return {
			isOpen:true,
		}
	},
	components:{
		routeTag,
		menuTree
	},
	methods: {
		select(){
		
		},
		closeMenu(){
			this.isOpen = !this.isOpen
		},
		go(e){
			console.log("go",e)
			this.$store.dispatch("setActiveRoute",e)
			this.$router.push(e)
		},
		close(e){
			console.log("close",e)
			this.$store.dispatch("removeTab",e)
		}
	},
	computed:{
		...mapGetters(["openPages","activeRouter","caches"]),
		...mapState(["menu"]),
		defaultActive(){
			return this.$route.path
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.hello {
  height: 100%;
}
.header{
	height: 82px !important;
	padding: 0 20px 0 0;
	border-bottom: 1px solid #eee;
}
.navbar{
	font-size: 24px;
	display: flex;
	justify-content: space-between;
	.menu-close{
		padding: 0 20px;
	}
	.menu-close:hover{
		background-color: #eee;
		cursor: pointer;
	}
	margin-bottom: 10px;
}
.route-tag{
	display: flex;
	justify-content: flex-start;
	padding: 0 20px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
/deep/ .el-main{
	// background: #eef0f3;
}
/deep/ .el-menu{
	transition: all .5s;
}
// /deep/ .el-menu-item{
// 	padding-left: 15px !important;
// 	.el-tooltip,.el-submenu__title{
// 		padding-left:15px !important;
// 	}	
// }
// /deep/ .el-submenu{
// 	.el-submenu__title{
// 		padding-left:15px !important;
// 	}	
// }
.child-view {

  transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(-80px, 0);
  transform: translate(-80px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}
</style>
