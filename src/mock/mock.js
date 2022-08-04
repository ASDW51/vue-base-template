import Mock from "mockjs"
Mock.mock("/test","get",(options)=>{
	console.log("mock--/test",options)
	return Mock.mock({"code":200,"data":"success"})
})

Mock.mock("/swipe","get",(options)=>{
	console.log("mock--/swipe",options)
	return Mock.mock({"code":200,"data|3":["@image(\"100x200\")"]})
})



Mock.setup({timeout:300})