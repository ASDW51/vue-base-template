export class UsePage {
	/**
	 * @param {object}  
	 */
	constructor({ api, filter = {},toast=true }) {
		// 请求条件
		this.filter = {
			pageNum: 1,
			...filter
		}
		//存放其他返回值
		this.otherData = {}
		/**
		 * 搜索
		 * @param {object} params
		 */
		this.search = async (params = {}) => {
			this.filter = {...this.filter, ...params}
			try {
				this.loadStatus = 2
				
				let { list:data, pages:lastPage, pageNum:currentPage,...other} = await api(this.filter)
				this.otherData = other
				// 如果是第一页而且data有数据，清空数据
				if (this.filter.pageNum === 1 && this.data.length) {
					this.data.splice(0, this.data.length)
				}
				this.data.push(...data)
				// {
				// 	"pages": 0,
				// 	"total": 0,
				// 	"pageNum": 1,
				// 	"pageSize": 2,
				// 	"list": []
				// }
				// debugger

				//没有数据比没有更多数据优先级高
				if(data.length === 0 && this.data.length==0) {
					// 没有数据
					this.loadStatus = 4
				}else if (lastPage <= currentPage) {
					// 没有更多数据
					this.loadStatus = 3
				} else{
					this.loadStatus = 1
				}

				if (this.filter.pageNum < lastPage) this.filter.pageNum++

			} catch (error) {
				// 加载失败
				this.loadStatus = 0
				console.log(error)
				
				throw new Error(error)
			}
		}

	}

	// 当前页
	currentPage = 1

	// 0 加载失败 1加载完成 2 加载中 3没有更多数据 4没有数据
	loadStatus = 1

	// 接口返回数据
	data = []

	// 清空搜索条件
	clearFilter = () => {
		this.filter = {
			page: this.currentPage
		}
	}
}

export const usePage = (parmas) => {
	return new UsePage(parmas)
}

export default {
	install(Vue) {
		Vue.prototype.usePage = function (parmas) {
			return new UsePage(parmas)
		}
	}
}