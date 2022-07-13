const fileList = require.context("./",true,/\.js$/)
const path = require("path")
const modules = {}

fileList.keys().forEach(filePath=>{
    let mod = require('./'+path.join(filePath))
    mod = mod.default
    // 需要设置name属性
    let name = ''
    if(mod&&!mod.name){
        //截取默认名字
        name = filePath.substring(0,filePath.lastIndexOf('.')).replaceAll(".","").split("/").filter(item=>item!='')
        // name = name.length>1?name[name.length-2]:name[0]
        name = name[0]
    }else if(mod) {
        name = mod.name
    }
    if(mod){
        modules[name]?modules[name]={...modules[name],...{...mod}}:modules[name] = mod
    }
    
})
export default {
    install:(Vue)=>{
        console.log("this.$request=",modules)
        Vue.prototype.$request = modules
    }
}