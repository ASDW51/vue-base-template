import store from "@/store"

export default async (that)=>{
	let roleOption = []    
    roleOption = store.state.role.map(item=>({value:item.id,label:item.name}))
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
		],
		reqOptions:{
			list:{
				method:"get",
				url:"/user",
			},
		},
		search:{
			form:{},
			options:[
				{
					key:"nickname",
					type:"el-input",
					label:"用户昵称",
					required:false,
    
				},
				{
					key:"openid",
					type:"el-input",
					label:"openid"
    
				},
                
				{
					key:"test1",
					type:"el-select",
					label:"用户类型",
					required:false,
					options:roleOption
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
					label:"添加",
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
				}
			],
			direction:"h"
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
						type:"el-select",
						options:roleOption
					}
				]
			}
		},
	}
}