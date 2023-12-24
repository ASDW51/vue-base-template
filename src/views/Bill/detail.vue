<template>
    <div class="detail">
        <div>
			<van-sticky>
                <div class="detail-header">
                    账单详情
                    <div class="icon-back" @click="back">
                </div>

                </div>
			</van-sticky>
              
        </div>
		<div class="detail-container">
            <div class="detail-info">
                <div class="bill-no">账单号: {{ bill.billNo }} 
                        <van-icon 
                            class-prefix="icon" 
                            name="copy" 
                            size="15" 
                            color="#ff8652" 
                            @click="copyBillNo(bill.billNo)"/>
                    </div>
                    <div class="status">支付状态: {{ bill.status }}</div>
                   
                    <div>账单活动时间: {{ bill.activeDate }}</div>
                    <div>账单金额：{{ bill.orderMoney }}</div>
                    <div>所属销售: {{ bill.salesName }}</div>
            </div>
			<div class="order-count">
				当前单量: {{ bill.orderNum }}
			</div>
			<div class="order-item" v-for="item in bill.orderList" :key="item.id">
				<div class="order-header">
					<div class="order-title">
						<van-icon 
							class-prefix="icon" 
							name="meituanwaimai"  
							size="20" 
							color="#ffd100"
							v-if="bill.platform=='美团外卖'"/>
						<van-icon 
							class-prefix="icon" 
							name="elemo"  
							size="20" 
							color="#01B6FD"
							v-else/>
						<span class="text">{{ bill.platform }} : {{ item.orderNo }}</span>
					</div>
					<div>
						<van-icon 
							class-prefix="icon" 
							name="copy" 
							size="15" 
							color="#ff8652" 
							@click="copyBillNo(item.orderNo)"/>
					</div>
				</div>
				<div class="content">
					<div class="date">
						上传日期: {{ item.orderCreateTime }}
					</div>
					<div class="block" @click="item.msg='已拉黑'">
						{{ item.msg }}
					</div>
				</div>
				<div class="order-imgs">
					<van-image
						width="93"
						height="100"
						:src="img | getFilePath"
						v-for="(img,index) in item.imgList"
						:key="img"
						@click="previewImg(item.imgList,index)"
					/>
				</div>
			</div>
		</div>
        <div class="bill-footer">
			<van-button
				color="#FF6100" 
				round
				disabled
					>
				导出excel
			</van-button>
			<van-button
				color="#FF6100" 
				round
				:disabled="bill.status=='已支付' || bill.status=='坏账'"
				@click="pay"
					>
				{{ bill.status=='未支付'?'立即结算':bill.status }}
			</van-button>               
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
    </div>
</template>
<script>
import {getFilePath} from "@/filters/index"
import { Toast,ImagePreview } from "vant"
import {GetQueryString} from "./index"
export default{
	data(){
		return {
			checked:true,
			checkedId:[],
			checkAll:false,
			total:0,
			loading:false,
			qrcode:{
				id: 2,
				img: "",
				isDefault: 1,
				remark: "",
			},
			showPayDialog:false,
			images:[],
			bill:{},
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
		async getInfo(){
			let billNo = this.$route.query.billNo
			if(!billNo){
				Toast.fail("参数错误")
				return
			}
			let res = await this.$request.bill.getBillInfo({
				billNo:billNo
			})
			res.orderList = res.orderList.map(item=>{
				return {
					...item,
					msg:"+门店拉黑用户"
				}
			})
			console.log(res)
			this.bill = res
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
		previewImg(imgList,i){
			let list = imgList.map(item=>getFilePath(item))
			ImagePreview({
				images: list,
				startPosition: i,
				closeable: true,
			})
		},
		back(){
			this.$router.back()
		},
		async pay(){
			let openId = this.$store.state.openId
			this.$request.bill.genPreOrder({
				openId,
				billNoList:[this.bill.billNo]
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
					that.getInfo()
				}
			})
		},
		beforeClose(action,done){
			done(false)
		}
	},
	async created(){
		await this.getInfo()
		document.title="账单详情"
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
	}
}
</script>
<style scoped lang="less">
.detail{
    background-color: #F6F6F6;
    min-height: 100%;
}
.detail-header{
    background-color: #fff;
    padding: 10px 0;
    text-align: center;
    position: relative;
    font-size: 16px;
    color: rgb(51, 51, 51);
}
.detail-container{
    padding: 12px 15px 100px;

}
.icon-back{
    width:10px;
    height: 10px;
    border:rgb(51, 51, 51) 2px solid;
    border-right: none;
    border-bottom: none;
    position: absolute;
    left: 20px;
    top: 50%;
    transform: rotate(-45deg) translateY(-50%);
}
.detail-container{
	.order-count{
		text-align: center;
		color: #ff7d46;
		background-color: #fee9ca;
		padding:10px 0 20px 0;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	& .order-item:nth-child(3){
		margin-top:-10px;
	}
	.order-item{
		margin:0 0 10px 0;
		padding: 5px 0 12px;
		background: #FFF;
		border-radius: 8px;
		// box-shadow: 0 0 4px rgba(3,12,26,.2);
		.order-header{
			padding:10px 12px 15px;
			display:flex;
			align-items:center;
			justify-content:space-between;
			border-bottom:1px dashed #CCCCCC;
			.order-title{
				display:flex;
				align-items:center;
			}
			.text{
				margin-left:10px;
			}
		}
		.content{
			display:flex;
			justify-content:space-between;
			padding:12px;
			.date{
				color:#999;
				// line-height:22px;
			}
			.block{
				transform: scale(85%);
				background-color: #f6f6f6;
				border-radius: 0.3125rem;
				padding: 0.125rem 0.1875rem;
			}
		}
		.order-imgs{
			display:flex;
			gap:8px;
			flex-wrap:wrap;
			padding:0 12px;
		}
	}
}
.detail-info{
	margin:0 0 10px 0;
	padding: 5px 12px 12px;
	flex: 1;
	color: #777;
	font-size: 12px;
	box-shadow: 0 0 4px rgba(3,12,26,.2);
	border-radius: 8px;
	background: #FFF;
	position: relative;
	.bill-no{
		color: #333;
		font-size: 15px;
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
		margin-bottom: 5px;
	}
	div{
		line-height:20px;
	}
	.icon-right{
		position: absolute;
		top: 50%;
		transform: translate(0,-50%);
		right: 12px;
	}
}
.bill-footer{
    position: fixed;
    bottom: 0;
    padding:15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
	display:flex;
	justify-content:space-evenly;
    background-color: #FFF;
    .van-button{
		margin:0 10px;
       flex:1;
        height: 50px;
        border-radius: 23px;
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
</style>