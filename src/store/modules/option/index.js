export default {
    namespaced:true,
    state:{
        baseMenu:[],
        menuType:[],
        menuList:[],
    },
    mutations:{
        setMenuType(state,menuType){
            state.menuType = menuType
        },
        setMenuList(state,menuList){
            state.menuList = menuList
        },
        setBaseMenuList(state,baseMenu){
            baseMenu.unshift({label:"根目录",value:0,type:0})
            state.baseMenu = baseMenu
            state.menuList = baseMenu
        }
    },
    actions:{
        
    }
}