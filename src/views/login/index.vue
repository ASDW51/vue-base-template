<template>
    <div>
        <el-form>
            <el-form-item label="用户名">
                <el-input v-model="username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="password"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {login} from "@/apis/user/index"
import {dynamicRouter} from "@/util/index"
export default {
	data(){
		return {
			username:"",
			password:""
		}
	},
	methods:{
		login(){
			login({
				nickname:this.username,
				pwd:this.password
			}).then(res=>{
				console.log(res)
				if(res.data.token){
					localStorage.setItem("token",res.data.token)
					//存入store,localStorge,addRoute
					let routes = []
					dynamicRouter(res.data.router,routes)
					console.log(routes)
					// 解析完再存入
					this.$store.dispatch("addRouter",routes)
					// 存树形结构
                    
					this.$store.dispatch("addTreeMenu",res.data.router)
					this.$router.push("/")
				}
			})
		}
	}
}
</script>