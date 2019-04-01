<template>
	<view class="user">
		<view class="top">
			<view class="top-content">
				<view class="avatar"><v-icon type="user-round" size="80" color="#8acdff"></v-icon></view>
				<view class="user-info">
					<text class="username">{{NAME || ""}}</text>
					<text>{{userName}}</text>
				</view>
			</view>
		</view>
		<view class="block">
			<navigator class="row" :url="page.modifyInfo">
				<view class="row-label"><v-icon type="info"></v-icon><text>修改个人资料</text></view>
				<v-icon type="arrow-right"></v-icon>
			</navigator>
			<navigator class="row" :url="page.resetPassword">
				<view class="row-label"><v-icon type="unlock"></v-icon><text>修改密码</text></view>
				<v-icon type="arrow-right"></v-icon>
			</navigator>
		</view>
		<view class="block">
			<view class="row">
				<view class="row-label"><v-icon type="monitor"></v-icon><text>开启告警监控</text></view>
				<!-- 防止设置失败时，开关状态修改无效，故写了俩 -->
				<view>
					<switch v-if="refreshNotify" :checked="isNotify" :disabled="notifyLoading" @change="notifyChange" />
					<switch v-else :checked="isNotify" :disabled="notifyLoading" @change="notifyChange" />
				</view>
			</view>
			<navigator class="row" v-if="isAdmin" :url="page.userAudit">
				<view class="row-label"><v-icon type="user-round"></v-icon><text>用户审批</text></view>
				<v-icon type="arrow-right"></v-icon>
			</navigator>
			<view class="row" @click="showShare = true;">
				<view class="row-label"><v-icon type="app"></v-icon><text>App分享</text></view>
				<v-icon type="arrow-right"></v-icon>
			</view>
			<view class="row">
				<view class="row-label"><v-icon type="version"></v-icon><text>版本信息</text></view>
				<text class="grey">{{version}}</text>
			</view>
		</view>
		<button class="btn-logout" @click="beforeLogout">退出登录</button>
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
	import {mapMutations} from "vuex"
	import api from "@/api/user.js"
	import ut from "@/common/utils.js"
	import common from "@/api/common.js"
	import vPop from "@/components/modal/v-pop.vue"

	export default {
		name: "user",
		data(){
			return {
				isAdmin: false,
				isNotify: true,
				notifyLoading: false,
				refreshNotify: true,
				userName: "",
				version: "v0.0.0",
				showShare: false
			}
		},
		components: {vPop},
		computed: {
			page(){
				return this.$page;
			},
			NAME(){
				return this.$store.state.NAME;
			}
		},
		mounted(){
			console.log("name", this.NAME)
			this.init();
			//#ifdef APP-PLUS
				this.version = plus.runtime.version;
			//#endif
		},
		methods: {
			...mapMutations(["setName"]),
			init(){
				let roles = uni.getStorageSync("userInfo");
				console.log("userInfo", roles);
				if(roles){
					this.userName = roles.userName;
					if(roles.roleCode){
						roles = roles.roleCode.split(",");
						console.log("roles", roles, roles.indexOf("admin"));
						if(roles.indexOf("admin") >= 0){
							this.isAdmin = true;
						}
					}
				}
				let isNotify = uni.getStorageSync("isNotify");
				this.isNotify = isNotify;
				this.getInfo();
			},
			beforeLogout(){
				let _this = this;
				uni.showModal({
					title: "提示",
					content: "您确定要退出登录吗？",
					success: res => {
						if(res.confirm) _this.logout();
					}
				});
			},
			logout() {
				ut.showLoading("正在退出");
				common.logout().then(res => {
					ut.showToast(res.msg, "success");
					uni.removeStorage({
						key: "sessionId"
					});
					//清除缓存密码
					let loginData = uni.getStorageSync("loginData");
					if(loginData && loginData.userName){
						uni.setStorage({
							key: "loginData",
							data: {userName: loginData.userName}
						});
					}
					setTimeout(() => {
						uni.reLaunch({
							url: this.$page.login
						});
					}, 1000);
				});
			},
			notifyChange(e){
				console.log("e", e);
				this.notifyLoading = true;
				this.updateNotify(e.detail.value);
			},
			getInfo(){
				api.info().then(res => {
					console.log("res", res);
					let isNotify = res.data.isNotify;
					let NAME = res.data.NAME;
					this.setName(NAME);
					uni.setStorageSync("isNotify", isNotify === "1");
					if(isNotify === "1"){
						this.isNotify = true;
					}
				}).catch();
			},
			updateNotify(isNotify){
				ut.showLoading("正在设置");
				api.updateNotify(isNotify ? "1" : "0").then(res => {
					ut.showToast(res.msg, "success");
					this.notifyLoading = false;
					this.isNotify = isNotify;
					uni.setStorageSync("isNotify", isNotify);
				}).catch(err => {
					this.notifyLoading = false;
					this.isNotify = !isNotify;
					this.refreshNotify = false;
					this.$nextTick(() => {
						this.refreshNotify = true;
					});
				});
			},
			share(scene){
// 				uni.showModal({
// 					title: "提示",
// 					content: "该功能暂未开放",
// 					showCancel: false
// 				});
				this.showShare = false;
				uni.share({
					provider: "weixin",
					scene,
					type: 2,  //纯图片
					title: "智能感知平台",
					imageUrl: "../../static/img/share.jpg",
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
		}
	}
</script>

<style lang="scss">
	@import "../../static/img/user-bg.scss";
	$startColor: #00bbfc;
	$endColor: #0091fb;
	.user{
		.top{
			width: 100%;
			height: 270upx;
			background: gradient(top, $startColor, $endColor);/*火狐*/ 
			background: -webkit-gradient(linear, 0% 0%, 0% 100%,from($startColor), to($endColor));/*谷歌*/ 
			background: -webkit-gradient(linear, 0% 0%, 0% 100%, from($startColor), to($endColor));      /* Safari 4-5, Chrome 1-9*/
			background: -webkit-linear-gradient(top, $startColor, $endColor);   /*Safari5.1 Chrome 10+*/
			.top-content{
				height: 280upx;
				background: url($userBg) no-repeat bottom;
				background-size: 750upx auto;
				display: flex;
				$avatarS: 120upx;
				padding: 40upx 54upx;
				box-sizing: border-box;
				.avatar{
					width: $avatarS;
					height: $avatarS;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 50%;
					border: 4upx solid #66c5f2;
					background: #FFF;
					overflow: hidden;
				}
				.user-info{
					margin: 40upx;
					color: #FFF;
					display: flex;
					flex-direction: column;
					font-size: 30upx;
					.username{
						font-size: 32upx;
						font-weight: 600;
					}
				}
			}
		}
		.block{
			margin: 20upx 0;
			border-top: 1px solid #DDD;
			.row{
				height: 104upx;
				background-color: #FFF;
				border-bottom: 1px solid #DDD;
				padding: 0 50upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.row-label{
					display: flex;
					align-items: center;
					font-size: 30upx;
					$iconS: 36upx;
					.v-icon{
						margin-right: 24upx;
						width: $iconS;
						height: $iconS;
						font-size: $iconS;
						color: #8a8a8a;
					}
				}
				.grey{
					font-size: 30upx;
				}
			}
		}
		.btn-logout{
			background: #FFF;
			font-size: 30upx;
			height: 96upx;
			line-height: 96upx;
			color: #D00;
			margin: 30upx 0 20upx;
		}
		.v-pop{
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
	}
</style>
