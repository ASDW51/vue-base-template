import store from "@/store"

export default async (that)=>{
    return {
        columns:[
            {
                key:"name",
                label:"角色名称"
            },
            {
                key:"remark",
                label:"备注"
            },
            {
                key:"opration",
                label:"操作",
                slot:"opration"
            }
        ],
        reqOptions:{
            list:{
                method:"get",
                url:"/role",
                callback(t,res){
                    console.log(t,res)
                    store.dispatch("roleMod/setMenuList",res.data.menuList)
                }
            },
            insert:{
                method:"post",
                url:"/role"
            },
            update:{
                method:"put",
                url:"/role"
            },
            remove:{
                method:"delete",
                url:"/role/${id}"
            }
        },
        search:{

        },
        opration:{
            form:{},
            options:[
                {
                    key:"btn1",
					type:"el-button",
					label:"添加角色",
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
        updateField:async(form={})=>{
            return {
                form,
                direction:"h",
                options:[
                    {
                        key:"name",
                        type:"el-input",
                        label:"角色名称",
                        required:true
                    },
                    {
                        key:"remark",
                        type:"el-input",
                        label:"备注",
                    }
                ]
            }
        }
    }
}