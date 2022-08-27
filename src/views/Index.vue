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
          	<!-- <el-menu-item index="/">
				<i class="el-icon-message"></i>
				<span slot="title">
					导航一
				</span>
			</el-menu-item>
		  <el-submenu index="2">
			<template slot="title">
				<i class="el-icon-message"></i>
				<span slot="title">商品管理</span>
			</template>
			<el-menu-item index="about">添加</el-menu-item>
			<el-menu-item index="b">商品列表</el-menu-item>
			<el-menu-item index="c">商品列表</el-menu-item>
			<el-menu-item index="d">商品列表</el-menu-item>
		  </el-submenu> -->
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
		  <keep-alive>
			 <router-view></router-view>
		  </keep-alive>
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
		select(index){
		
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
		...mapGetters(["openPages","activeRouter"]),
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
</style>
