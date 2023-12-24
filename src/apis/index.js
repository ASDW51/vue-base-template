const fileList = require.context("./",true,/\.js$/)
const path = require("path")
const modules = {}

// function namespace(oNamespace,sPackage,mod){
//     let tempWarp = oNamespace
//     let spiArr = sPackage.split("/")
//     spiArr.forEach((item,index)=>{
//         if(index==spiArr.length-1){
//             tempWarp = tempWarp[item] = Object.assign(mod,tempWarp[item])
//         }else{
//             tempWarp = tempWarp[item] = Object.assign({},tempWarp[item])
//         }
//     })
//     return oNamespace
// }
fileList.keys().forEach(filePath=>{
	let mod = require("./"+path.join(filePath))
	mod = mod.default
	// 需要设置name属性
	let name = ""
	if(mod&&!mod.name){
		//截取默认名字
		name = filePath.substring(0,filePath.lastIndexOf(".")).replaceAll(".","").split("/").filter(item=>item!="")
		// name = name.length>1?name[name.length-2]:name[0]
		name = name[0]
	}else if(mod) {
		name = mod.name
	}
	// let spath = filePath.replace(/^\.\//,'').replace(/\.js/,'')

	// 两种不同的访问结构
	//根据目录层次构造对象  多层次
	// if(spath!='index' && mod){
	//     namespace(modules,spath,mod)
	// }
	// 根据 挂载到顶层目录名字的对象 ||　暴露出来的名称　－－　推荐 
	if(mod){
		modules[name]?modules[name]={...modules[name],...{...mod}}:modules[name] = mod
	}
    
})
console.log(modules)
export default {
	install:(Vue)=>{
		console.log("this.$request=",modules)
		Vue.prototype.$request = modules
	}
}