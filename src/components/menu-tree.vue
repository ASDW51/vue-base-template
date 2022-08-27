<template>
    <fragment>
        <template v-for="item in menuData">
           	<el-menu-item :index="item.path" v-if="item.type==1" :key="item.id">
				<i :class="item.icon"></i>
				<span slot="title">
					{{item.cname}}
				</span>
			</el-menu-item>
		  <el-submenu :index="item.id+''" v-else :key="item.id">
			<template slot="title">
				<i :class="item.icon"></i>
				<span slot="title">{{item.cname}}</span>
			</template>
                <menu-tree :menuData="item.children"/>
		  </el-submenu>
        </template>
    </fragment>
</template>
<script>
export default {
	name:"menu-tree",
	props:{
		menuData:{
			type:Array,
			default:[]
		}
	}
}
</script>