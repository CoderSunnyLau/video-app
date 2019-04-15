<template>
	<view class="board-detail">
		<view class="title">{{resData.title}}</view>
		<view class="cnt">{{resData.content}}</view>
	</view>
</template>

<script>
	import api from "@/api/board.js"
	export default{
		data(){
			return {
				rec_id: "",
				resData: {}
			}
		},
		onLoad(opt){
			if(opt.rec_id){
				this.rec_id = opt.rec_id;
				this.getDetail();
			}
		},
		methods: {
			getDetail(){
				api.detail(this.rec_id).then(res => {
					this.resData = res.data;
				}).catch();
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #FFF;
	}
	.board-detail{
		.title{
			line-height: 100upx;
			font-size: 30upx;
			margin: 0 150upx;
			text-align: center;
			border-bottom: 1px solid #DDD;
		}
		.cnt{
			padding: 36upx;
			line-height: 32upx;
		}
	}
</style>
