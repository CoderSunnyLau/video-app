<template>
	<view class="v-share">
		<v-pop v-model="showShare" no-header>
			<view class="share-box">
				<view class="share-btn" @click="share('WXSceneSession')">
					<v-icon type="wechat-circle-filled" color="#51C332" size="80"></v-icon>
					<text>分享给好友</text>
				</view>
				<view class="share-btn" @click="share('WXSenceTimeline')">
					<v-icon type="friends-circle-circle-filled" color="#4792d3" size="80"></v-icon>
					<text>分享到朋友圈</text>
				</view>
			</view>
		</v-pop>
	</view>
</template>

<script>
	import vPop from "@/components/modal/v-pop.vue"
	import ut from "@/common/utils.js"
	
	let timer = 0;
	let count = 0;
	
	export default {
		name: "vShare",
		data(){
			return {
				showShare: false
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			imgUrl: String
		},
		components: {vPop},
		watch: {
			value(val){
				this.showShare = val;
			},
			showShare(val){
				if(val === false) this.$emit("input", val);
			}
		},
		methods: {
			onCancel(){
				this.$emit("cancel");
				this.$emit("input", false);
			},
			onConfirm(){
				this.$emit("confirm");
				this.$emit("input", false);
			},
			share(scene){
				console.log("count:" + count + ", scene:" + scene);
				clearTimeout(timer);
				count++;
				timer = setTimeout(() => {  //等待canvas图片保存到临时路径再进行分享，否则获取不到图片地址会报错
					if(!this.imgUrl){
						if(count <= 5){
							this.share(scene);
						}else{
							count = 0;
						}
						return;
					}else{
						count = 0;
						this.$emit("input", false);
						console.log("imgUrl" + this.imgUrl);
						console.log("scene:" + scene);
						uni.share({
							provider: "weixin",
							scene: scene,
							type: 2,  //纯图片
							title: "智能感知平台",
							imageUrl: this.imgUrl,
							success: res => {
								// ut.showToast("success:" + JSON.stringify(res));
								ut.showToast("分享成功", "success");
								console.log("success:" + JSON.stringify(res));
							},
							fail: err => {
								let msg = err.errMsg;
								if(msg){
									msg = !~err.errMsg.indexOf("-2") ? err.errMsg : "已取消分享";
								}else{
									msg = JSON.stringify(err);
								}
								ut.showToast(msg);
								// ut.showToast("分享失败");
								console.log("fail:" + JSON.stringify(err));
							}
						});
					}
				}, 200);
			}
		}
	}
</script>

<style lang="scss">
	.v-share{
		.box{
			height: 180upx;
		}
		.share-box{
			height: 180upx;
			display: flex;
			align-items: center;
			justify-content: space-around;
		}
		.share-btn{
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 24upx;
			color: #999;
			.v-icon{
				margin-bottom: 10upx;
			}
		}
	}
</style>