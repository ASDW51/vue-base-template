<template>
    <div>
        <div class="bill-tabs">
			<van-sticky>
				<van-tabs type="card" 
					v-model="activeTab"
					@change="tabChangeHandle"
					sticky
					background="#F6F7F9" 
					color="#FCFDFF" 
					title-inactive-color="#969799"
					title-active-color="#E2794C">
                    <van-tab :title="item" v-for="item in tabs" :key="item">
						
                    </van-tab>
					<!-- <van-tab title="未支付账单">
					
					</van-tab> -->
            </van-tabs>
			</van-sticky>
              
        </div>
		<div class="bill-container">
			<!-- <div class="bill-header">
				{{date}}
			</div> -->
			<van-list
				v-model="loading"
				:finished="finished"
				finished-text=""
				@load="upLoad"
				loading-text=" "
				>
				<van-checkbox-group v-model="checkedId" @change="groupChange">

				<div v-for="(val,key) in tableData" :key="key">
					<div class="bill-header">
						{{key}}
					</div>
					<div class="bill-content">
						<div class="bill-item" v-for="item in val" :key="item.id">
							<van-checkbox :name="item.id"  icon-size="16" checked-color="#FBD583" v-if="canChecked">
							</van-checkbox>
							<div class="bill-info" @click="toDetail(item.billNo)">
								<div class="bill-no">账单号: {{ item.billNo }} 
									<van-icon 
										class-prefix="icon" 
										name="copy" 
										size="15" 
										color="#ff8652" 
										@click="copyBillNo(item.billNo)"/>
								</div>
								<div class="status">支付状态: {{ item.status==1?"已支付":"未支付" }}</div>
								<div>店铺名: {{ item.shopName }}</div>
								<div>平台类型: {{ item.platform }}</div>
								<div>订单数量: {{ item.orderNum }}</div>
								<div>账单活动时间: {{ item.activeDate }}</div>
								<div>所属销售: {{ item.salesName }}</div>
								<div>账单金额：{{ item.orderMoney }}</div>
								<van-icon class-prefix="icon" name="right" size="12" color="#000" />
							</div>
						</div>
					</div>
				</div>
				<!-- <div class="bill-content">
					<van-checkbox-group v-model="checkedId" @change="groupChange">
						<div class="bill-item" v-for="item in pg.data" :key="item.id">
							<van-checkbox :name="item.id"  icon-size="16" checked-color="#FBD583"></van-checkbox>
							<div class="bill-info" @click="toDetail(item.billNo)">
								<div class="bill-no">账单号: {{ item.billNo }} 
									<van-icon 
										class-prefix="icon" 
										name="copy" 
										size="15" 
										color="#ff8652" 
										@click="copyBillNo(item.billNo)"/>
								</div>
								<div class="status">支付状态: {{ item.status==1?"已支付":"未支付" }}</div>
								<div>店铺名: {{ item.shopName }}</div>
								<div>平台类型: {{ item.platform }}</div>
								<div>订单数量: {{ item.orderNum }}</div>
								<div>账单活动时间: {{ item.activeDate }}</div>
								<div>所属销售: {{ item.salesName }}</div>
								<div>账单金额：{{ item.orderMoney }}</div>
								<van-icon class-prefix="icon" name="right" size="12" color="#000" />
							</div>
						</div>
					</van-checkbox-group>
				</div> -->
			</van-checkbox-group>

			</van-list>
			<loadStatus :pg="pg"></loadStatus>
		</div>
        <div class="bill-footer">
                <div class="check-info">
                    <van-checkbox v-model="checkAll"
                    @change="allChangeHandle"
					:disabled="pg.data.length==0"
                    icon-size="16" checked-color="#FBD583"
					v-if="canChecked">
                    </van-checkbox>
                    <div class="info-right" v-if="checkedId.length==0">
                        <span v-if="canChecked">全选</span>
						已加载{{pg.data.length }} / {{ pg.otherData.total }}
                    </div>
                    <div class="info-right" v-else>
                        <span>
                             已选{{checkedId.length }} / {{ pg.data.length }}</span>
                        <div class="price-container">
                            合计
                            <span class="price">
                                ￥
                                <span class="totalPrice">{{ totalPrice }}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div v-if="canChecked">
                    <van-button
						color="#FF7D46" 
						:disabled="checkedId.length==0" 
						@click="pay"
                         >
                        结算
                    </van-button>
                </div>                   
        </div>
		<van-dialog
			v-model="showPayDialog"
			title="微信支付"
			showCancelButton
			confirm-button-text="立即支付"
			@confirm="confirmPay"
			@cancel="showPayDialog = false"
			:before-close="beforeClose"
			>
			<div class="dialog">
				<div class="tips">
					<div>
						订单号
						<div>{{ wxOrder.no }}</div>
					</div>
				</div>
				<div class="tips">
					<div>
						金额：
						<span class="price">￥{{ wxOrder.totalPrice }}</span>
					</div>
					<!-- <div class="tip">如长按图片没有识别到二维码，请保存图片后到客户端扫码付款</div> -->
				</div>
			</div>
		</van-dialog>
		<van-image 
			width="65"
			height="65"
			:src="rimg" 
			class="staticImg"
			@click="toLogin"
		/>
    </div>
</template>
<script>
import NP from "number-precision"
import loadStatus from "@/components/loadStatus.vue"
import {getFilePath} from "@/filters/index"
import { Toast } from "vant"
import rimg from "@/assets/czsx.png"
import {GetQueryString, toLogin} from "./index"
import dayjs from "dayjs"
export default{
	components:{
		loadStatus
	},
	data(){
		return {
			checked:true,
			list:[],
			checkedId:[],
			checkAll:false,
			total:0,
			pg:this.usePage({
				api:this.$request.bill.getBillDetail
			}),
			loading:false,
			tabs:["历史账单","未支付账单"],
			activeTab:1,
			qrcode:{
				id: 2,
				img: "",
				isDefault: 1,
				remark: "",
			},
			showPayDialog:false,
			finished:false,
			rimg,
			date:"",
			wxOrder:{
				appId:"",
				no:"",
				totalPrice:"",
				nonceStr:"",
				packageValue:"",
				timestamp:"",
				paySign:""
			}
		}
	},
	methods:{
		toLogin,
		groupChange(ids){
			if(ids.length==this.pg.data.length && this.pg.data.length!=0){
				this.checkAll = true
			}else{
				this.checkAll = false
			}
		},
		allChangeHandle(bool){
			if(bool){
				this.checkedId = this.pg.data.map(item=>item.id)
			}else{
				this.checkedId = []
			}
		},
		async upLoad(){
			console.log("load",this.loading)
			this.loading = true
			let query = this.$route.query
			if(this.activeTab==0){
				await this.pg.search({
					...query,
					status:1,
					activeDate:"",
				})
			}else{
				await this.pg.search({
					...query,
					status:0,
					activeDate:"",
				})
			}
			debugger
			this.loading = false
			if(this.pg.loadStatus == 3 || this.pg.loadStatus == 4){
				this.finished = true	
			}
		},
		async tabChangeHandle(index){
			let query = this.$route.query
			console.log(index)
			this.loading = true
			this.finished = false
			if(index==0){
				await this.pg.search({
					...query,
					activeDate:"",
					pageNum:1,
					status:1
				})
			}else{
				await this.pg.search({
					...query,
					pageNum:1,
					status:0,
					activeDate:""
				})
			}
			this.loading = false
			if(this.pg.loadStatus == 3 || this.pg.loadStatus == 4){
				this.finished = true	
			}
			this.checkAll = false
			this.checkedId = []
		},
		copyBillNo(billNo){
			this.$copyText(billNo).then(res=>{
				console.log(res)
				Toast.success("复制成功")
			},err=>{
				console.warn(err)
				Toast.fail("复制失败,请手动复制")
			})
		},
		toDetail(billNo){
			this.$router.push({
				path:"/bill/detail",
				query:{
					billNo:billNo
				}
			})
		},
		async pay(){
			console.log(this.checkedId)

			let billNoList = this.pg.data.filter(item=>this.checkedId.includes(item.id)).map(item=>item.billNo)
			console.log(billNoList)
			let openId = this.$store.state.openId
			this.$request.bill.genPreOrder({
				openId,
				billNoList:billNoList.sort((a,b)=>a-b)
			}).then(res=>{
				this.wxOrder = res
				this.showPayDialog = true
			})
		},
		confirmPay(){
			console.log("confirm Pay")
			let that = this
			// eslint-disable-next-line no-undef
			WeixinJSBridge.invoke("getBrandWCPayRequest", {
				"appId": this.wxOrder.appId,     //公众号ID，由商户传入     
				"timeStamp": this.wxOrder.timestamp,     //时间戳，自1970年以来的秒数     
				"nonceStr": this.wxOrder.nonceStr,      //随机串     
				"package": this.wxOrder.packageValue,
				"signType": "RSA",     //微信签名方式：     
				"paySign": this.wxOrder.paySign //微信签名 
			},
			function(res) {
				if (res.err_msg == "get_brand_wcpay_request:ok") {
					// 使用以上方式判断前端返回,微信团队郑重提示：
					//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
					Toast.success("支付成功")
					that.showPayDialog = false
					that.pg.data = that.pg.data.filter(item=>!that.checkedId.includes(item.id))
					that.checkedId = []
				}
			})
		},
		beforeClose(action,done){
			done(false)
		}
	},
	async created(){
		// let data = await this.$request.bill.getBillDetail()
		// console.log(data)
		// this.list  = data.list
		// this.total = data.total
		// this.pg.search()
		let date = null
		let activeDate = this.$route.query.activeDate
		if(activeDate){
			date = new Date(activeDate)
		}else{
			date = new Date()
		}
		this.date = date.getFullYear()+"年"+(date.getMonth()+1)+"月"
		let res = await this.$request.bill.getQrcode()
		this.qrcode = res
		document.title="店铺账单"
		
		let openId = this.$store.state.openId
		if(!openId){
			let code = GetQueryString("code")
			console.log(this)
			//检验code是否存在
			if(!code){
				let appid = "wxccf3f10fae34da5c"
				let redirect_uri = encodeURIComponent(location.href)
				const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base#wechat_redirect`
				location.href = url
			}else{
				this.$request.bill.getOpenId({code}).then(res=>{
					console.log(res)
					this.$store.commit("setOpenId",res)
					localStorage.setItem("openid",res)
				})
			}
		}
		
	},
	computed:{
		totalPrice(){
			return this.pg.data.filter(item=>this.checkedId.includes(item.id))
				.reduce((prev,next)=>{
					return NP.plus(prev,next.orderMoney)
				},0)
		},
		tableData(){
			let data = {}
			this.pg.data.forEach(item=>{
				let format = dayjs(item.activeDate,"YYYY-MM-DD").format("YYYY年MM月")
				console.log(format)
				if(!data[format]){
					data[format] = []
				}
				if(!data[format].some(ditem=>ditem.id==item.id)){
					data[format].push(item)
				}
			})
			return data
		},
		canChecked(){
			return this.activeTab == 1
		}
	}
}
</script>
<style scoped lang="less">
@contentPadding:0 15px;
.bill-container{
    // width: 100%;
    height: 100%;
    background-color: #FFF;
    position: relative;
    padding: 0 15px 120px 15px;
    .bill-header{ 
        font-size: 18px;
        padding-left: 21px;
        color: #222;
        font-weight: 700;
        line-height: 43px;
        position: relative;
        &:before {
            content: "";
            width: 10px;
            height: 10px;
            background-color: #ff7d46;
            border-radius: 50%;
            position: absolute;
            left: 0;
            top: 16px;
            z-index: 2
        }
        &::after{
            content: "";
            width: 10px;
            height: 10px;
            background-color: rgba(255,125,70,.5);
            border-radius: 50%;
            position: absolute;
            left: 5px;
            top: 16px;
            z-index: 2
        }
    }
    .bill-content{
        .bill-item{
            display: flex;
            align-items: center;
            
        }
        .bill-info{
            margin:0 0 10px 10px;
            padding: 5px 12px 12px;
            flex: 1;
            color: #777;
            font-size: 12px;
            box-shadow: 0 0 4px rgba(3,12,26,.2);
            border-radius: 8px;
            position: relative;
            .bill-no{
                color: #333;
                font-size: 13px;
                font-weight: 700;
                line-height: 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .status{
                background: #FEE9CA;
                color: #FF7E4C;
                display: inline-block;
                padding: 0px 10px;
            }
            div{
                line-height:22px;
            }
            .icon-right{
                position: absolute;
                top: 50%;
                transform: translate(0,-50%);
                right: 12px;
            }
        }
    }
}
.bill-tabs{
    padding:10px 0;
}
.bill-footer{
    position: fixed;
    bottom: 0;
    padding:15px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 92%;
    background-color: #FFF;
    .van-button{
        width: 84px;
        height: 40px;
        border-radius: 10px;
    }
    .check-info{
        display: flex;
        align-items: center;
        .info-right{
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            color: #222;
            line-height: 20px;
            .price-container{
                .price{
                    color: rgb(237, 16, 73);
                    .totalPrice{
                        font-size: 18px;
                    }
                }
            }
        }
    }
}
/deep/ .van-tabs__wrap{
    height: auto;
    min-height: 30px;
    .van-tabs__nav--card{
        height: auto;
        min-height: 30px;
        padding:10px;
        border-radius: 10px;
        .van-tab{
            padding:10px;
            border-radius: 10px;
        }
        .van-tab--active{
            box-shadow: 0px 3px 10px rgba(0,0,0,.1);
        }

    }
}
.dialog{
	text-align: center;
	.tips{
		text-align: left;
		color: #222;
		font-size: 16px;
		padding: 10px;
		line-height: 30px;
		.price{
			color: rgb(237, 16, 73);
		}		
		.tip{
			color: #777;
			font-size: 12px;
			line-height: 20px;
		}
	}
}
.staticImg{
	position:fixed;
	bottom:280px;
	right:10px;
}
</style>