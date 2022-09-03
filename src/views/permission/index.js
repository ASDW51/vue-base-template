import store from "@/store"

export default async (that)=>{
	return {
		columns:[
			{
				key:"cname",
				label:"菜单名称",
                align:"left"
			},
            {
                key:"name",
                label:"权限名称"
            },
            {
                key:"path",
                label:"路径"
            },
            {
                key:"cpath",
                label:"引用路径"
            },
            {
                key:"icon",
                label:"图标",
                slot:"icon"
            },
            {
                key:"perms",
                label:"访问权限"
            },
            {
                key:"type",
                label:"菜单类型",
                slot:"type"
            },
            {
                key:"weight",
                label:"排序权重"
            },
            {
                key:"createTime",
                label:"创建时间",
            },
            {
                key:"updateTime",
                label:"更新时间"
            }
		],
        reqOptions:{
            list:{
                method:"get",
                url:"/menu/base",
                callback:(that,res)=>{
                    console.log(res)
                    store.commit("option/setMenuType",res.data.menuType)
                    store.commit("option/setBaseMenuList",res.data.menuList)
                }
            },
            insert:{
                method:"post",
                url:"/menu",
            }
        },
        search:{
            form:{},
            options:[
                {
                    key:"aaa",
                    type:"el-input",
                    label:"测试"
                },
                {
                    key:"bbb",
                    type:"el-input",
                    label:"测试",
                    slot:"test"
                },
            ],
            direction:"h"
        },
        opration:{
            form:{},
            options:[
                {
                    key:"add",
                    type:"el-button",
                    label:"添加菜单",
                    removeLabel:true,
                    width:false,
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
        updateField:async (form)=>{
            return {
                form,
                options:[
                    {
                        key:"cname",
                        type:"el-input",
                        label:"菜单名称",
                        required:true
                    },
                    {
                        key:"name",
                        type:"el-input",
                        label:"路由名称",
                        required:true
                    },
                    {
                        key:"path",
                        type:"el-input",
                        label:"访问路径"
                    },
                    {
                        key:"cpath",
                        type:"el-input",
                        label:"视图路径"
                    },
                    {
                        key:"icon",
                        type:"el-input",
                        label:"显示图标"
                    },
                    {
                        key:"perms",
                        type:"el-input",
                        label:"访问权限"
                    },
                    {
                        key:"type",
                        type:"el-select",
                        label:"菜单类型",
                        options:[

                        ],
                        readStore:"menuType",
                        listeners:{
                            change(e){
                                console.log(e)
                                let baseMenu = store.state.option.baseMenu
                                // store.commit("option/setMenuType",[])
                                if(e==2){
                                    // 选择 按钮 menuList只显示页面
                                    store.commit("option/setMenuList",baseMenu.filter(item=>item.type == 1))
                                }else if(e==1 || e==0){
                                    //选择页面，只留目录类
                                    store.commit("option/setMenuList",baseMenu.filter(item=>(item.type == 0)))
                                }
                            }
                        }
                    },
                    {
                        key:"weight",
                        type:"el-input",
                        label:"排序权重"
                    },
                    {
                        key:"pid",
                        type:"el-select",
                        label:"上级菜单",
                        readStore:"menuList"
                    },
                    {
                        key:"addtab",
                        type:"el-switch",
                        label:"标签页",
                        props:{
                            activeValue:1,
                            inactiveValue:0
                        }
                    },
                    {
                        key:"close",
                        type:"el-switch",
                        label:"可关闭",
                        props:{
                            activeValue:1,
                            inactiveValue:0
                        }
                    },
                    {
                        key:"keep",
                        type:"el-switch",
                        label:"缓存页面",
                        props:{
                            activeValue:1,
                            inactiveValue:0
                        }
                    }

                ],
                direction:"h"
            }
        }
	}
}