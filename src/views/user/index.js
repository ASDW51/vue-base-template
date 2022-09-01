import { roleList } from "@/apis/role"
import store from "@/store"

export default async (that)=>{
	let roleOption = []    
    roleOption = store.state.role.map(item=>({value:item.id,label:item.name}))
	roleList().then(res=>{
		console.log(res)
	})
	return {
		columns:[
			{
				key:"id",
				label:"id",
			},
			{
				key:"nickname",
				label:"用户昵称",
			},
			{
				key:"openid",
				label:"微信openid",
				width:300
			},
			{
				key:"avatarUrl",
				label:"头像",
				slot:"avatar",
				width:80
			},
			{
				key:"roleId",
				label:"用户身份",
				slot:"role"
			},
			{
				key:"createTime",
				label:"创建时间",
			},
			{
				key:"updateTime",
				label:"修改时间",
			},
			{
				key:"loginTime",
				label:"上次登录",
			},
			{
				key:"opration",
				label:"操作",
				slot:"opration",
				removeBtn:{
					show:true,
					permission:""
				},
				editBtn:{
					show:true,
					permission:""
				},

			}
		],
		reqOptions:{
			list:{
				method:"get",
				url:"/user",
			},
			insert:{
				method:"post",
				url:"/user"
			},
			update:{
				method:"put",
				url:"/user"
			},
			remove:{
				method:"delete",
				url:"/user/${id}"
			}
		},
		search:{
			form:{},
			options:[
				{
					key:"nickname",
					type:"el-input",
					label:"用户昵称",
					required:false,
					props:{
						clearable:true
					}
    
				},
				{
					key:"openid",
					type:"el-input",
					label:"openid",
					props:{
						clearable:true
					}
				},
                
				{
					key:"roleId",
					type:"el-select",
					label:"用户类型",
					required:false,
					options:roleOption,
					props:{
						clearable:true
					}
				},
				{
					key:"test",
					type:"el-button",
					label:"查询",
					removeLabel:true,
					width:false,
					props:{
						type:"primary"
					},
					listeners:{
						click(...e){
							that.searchFun && that.searchFun instanceof Function && that.searchFun(...e)
							that.$emit("search")
							console.log("click")
							that.getList()
						}
					}
				},
			],
			direction:"h",
			labelPosition:"right"
		},
		opration:{
			form:{},
			options:[
				{
					key:"btn1",
					type:"el-button",
					label:"添加用户",
					width:false,
					removeLabel:true,
					props:{
						type:"primary",
						icon:"el-icon-plus"
					},
					listeners:{
						click:(...e)=>{
							console.log(that)
							that.addFun && that.addFun instanceof Function && that.addFun(...e)
						}
					}
				},
				{
					key:"btn2",
					type:"el-button",
					label:"刷新",
					width:false,
					removeLabel:true,
					props:{
						type:"warning",
						icon:"el-icon-refresh"
					},
					listeners:{
						click:(...e)=>{
							that.getList()
						}
					}
				}
			],
			direction:"h"
		},
		addField:async (form={})=>{
			return {
				form,
				direction:"h",
				options:[
					{
						key:"nickname",
						type:"el-input",
						label:"用户昵称",
						required:true,
						rules:[
							{ min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
						]
					},
					{
						label:"密码",
						key:"pwd",
						type:"el-input",
						required:true,
						rules:[
							{ min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
						],
						props:{
							type:"password"
						}
					},
					{
						label:"头像",
						key:"avatar_url",
						type:"el-upload",
						
						props:{
							action:"/dhd",
							class:"avatar-uploader"
						}
					},
					{
						label:"角色",
						key:"roleId",
						required:true,
						type:"el-select",
						options:store.state.role.map(item=>({value:item.id,label:item.name}))
					}
				]
			}
		},
		updateField:async (form={})=>{
			return {
				form,
				direction:"h",
				options:[
					{
						key:"nickname",
						type:"el-input",
						label:"用户昵称",
						required:true,
						rules:[
							{ min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
						]
					},
					{
						label:"头像",
						key:"avatar_url",
						type:"el-upload",
						
						props:{
							action:"/dhd",
							class:"avatar-uploader"
						}
					},
					{
						label:"角色",
						key:"roleId",
						required:true,
						type:"el-select",
						options:roleOption
					}
				]
			}
		},
	}
}