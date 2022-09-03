import {shallowMount} from "@vue/test-utils"
import routeTag from "@/components/route-tag.vue"

describe("route-tag.vue--路由tag",()=>{
	let wrapper = null
	beforeEach(()=>{
		console.log("beforeEach")
		wrapper = shallowMount(routeTag)
	})
	afterEach(()=>{
		console.log("afterEach")
	})
	it("组件参数缺省判断",()=>{
		console.log("开始测试1")
		expect(wrapper.vm.isActive).toBeFalsy()
		expect(wrapper.vm.label).toMatch("label未定义")
		expect(wrapper.vm.path).toMatch("/")
		expect(wrapper.vm.canClose).toBeTruthy()
		expect(wrapper.find(".text").text()).toMatch("label未定义")

	})
	test("测试props",async ()=>{
		console.log("开始测试2")
		await wrapper.setProps({
			isActive:true,
			label:"首页",
			path:"/home",
			canClose:false
		})
		expect(wrapper.vm.isActive).toBeTruthy()
		expect(wrapper.vm.label).toMatch("首页")
		expect(wrapper.vm.path).toMatch("/home")
		expect(wrapper.vm.canClose).toBeFalsy()
		expect(wrapper.find(".text").text()).toMatch("首页")
		expect(wrapper.vm.slen).toMatch("72")
	})
	test("测试点击事件",()=>{
		wrapper.trigger("click")
		expect(wrapper.emitted().click).toBeTruthy()


		expect(wrapper.emitted().close).toBeFalsy()
		wrapper.find(".show").trigger("click")
		expect(wrapper.emitted().close).toBeTruthy()
	})

})