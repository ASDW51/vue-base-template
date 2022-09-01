export default {
    name:"roleMod",
	namespaced:true,
    state:{
        menuList:[]
    },
    mutations:{
        setMenuList(state,playload){
            console.log("commit")
            state.menuList = playload
        }
    },
    actions:{
        setMenuList(context,playload){
            console.log("roleMod/dispatch")
            context.commit("setMenuList",playload)
        }
    }
}