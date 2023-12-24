<template>
	<div class="load-status">
		<div style="width:100%" :class="{'loading-filter': pg.loadStatus === 2}">
			<slot></slot>
		</div>
		<div class="status-wrap" v-if="isShow">
			<!-- 加载失败 -->
			<div class="" v-if="pg.loadStatus === 0" @click="search">
				加载失败，请重试
			</div>
			<!-- 加载成功 -->
			<div class="" v-if="pg.loadStatus === 1" @click="search">
				点击或者上拉加载更多
			</div>
			<!-- 加载中 -->
			<div class="loading" v-if="pg.loadStatus === 2">
				<div class="loading-img">
					<image src="~/static/img/search/loading.png"></image>
				</div>
				<span>加载中...</span>
			</div>
			<!-- 没有更多数据 -->
			<div class="" v-if="pg.loadStatus === 3" @click="search()">
				-到底了-
			</div>
		</div>
		<!-- 没有数据 -->
		<div class="no-data" v-if="pg.loadStatus === 4 && isShow">
			<image style="width: 174rpx;height: 174rpx;" src="~/static/img/shippingAddress/kongshuju.png"
				mode="aspectFit"></image>
			<span class="text">{{tip}}</span>
		</div>
	</div>
</template>

<script>
import {
	UserPage
} from "@/util/usePage.js"
export default {
	props: {
		pg: {
			type: UserPage,
			required: true
		},
		tip:{
			type: String,
			default: "没有数据"
		},
		show: {
			type: Array,
			default: null
		}
	},
	computed:{
		isShow(){
			return Array.isArray(this.show) ? this.show.includes(this.pg.loadStatus) : true
		}
	},
	methods: {
		search() {
			this.pg.search()
		}
	},
}
</script>

<style lang="less">
	@keyframes loading {
		0% {
			transform: rotate(0deg)
		}

		100% {
			transform: rotate(360deg)
		}
	}


	.load-status {
		color: #999999;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px 0;
		position: relative;

		.loading {
			display: flex;
			align-items: center;

			.loading-img {
				width: 20px;
				height: 20px;
				margin-right: 10px;
				animation: loading 1s linear infinite;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.no-data{
			display: flex;
			flex-direction: column;
			align-items: center;
			.text{
				margin-top: 10px;
			}
		}

		.status-wrap{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}


		.loading-filter{
			filter: blur(2px);
		}
	}
</style>
