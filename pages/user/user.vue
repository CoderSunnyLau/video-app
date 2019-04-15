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
			<view class="row" @click="beforeShare">
				<view class="row-label"><v-icon type="app"></v-icon><text>App分享</text></view>
				<v-icon type="arrow-right"></v-icon>
			</view>
			<view class="row">
				<view class="row-label"><v-icon type="version"></v-icon><text>版本信息</text></view>
				<text class="grey">{{version}}</text>
			</view>
		</view>
		<button class="btn-logout" @click="beforeLogout">退出登录</button>
		<v-share v-model="showShare" :imgUrl="tempUrl"></v-share>
		<view class="canvas-wrap">
			<canvas canvas-id="canvasShare" class="canvas-el"></canvas>
		</view>
	</view>
</template>

<script>
	import {mapMutations} from "vuex"
	import api from "@/api/user.js"
	import ut from "@/common/utils.js"
	import common from "@/api/common.js"
	import vShare from "@/components/v-share/v-share.vue"
	import QR from "@/common/qrcode.js" // 二维码生成器  
	
	let ctx = null;

	export default {
		name: "user",
		data(){
			return {
				isAdmin: false,
				isNotify: true,
				notifyLoading: false,
				refreshNotify: true,
				userName: "",
				showShare: false,
				QRcode: "",
				// ctx: {},
				shareBg: "../../static/img/share.jpg",
				tempUrl: ""
			}
		},
		components: {vShare},
		computed: {
			page(){
				return this.$page;
			},
			NAME(){
				return this.$store.state.NAME;
			},
			version(){
				return this.$store.state.version;
			},
			downloadUrl(){
				return this.$store.state.downloadUrl;
			},
			px(){
				return this.$store.state.px;
			}
		},
		mounted(){
			ctx = uni.createCanvasContext("canvasShare", this);
			// this.ctx = uni.createCanvasContext("canvasShare", this);  //不能这么写，App会报错。。。原因未知
			this.init();
			this.draw();
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
			draw(){
				this.QRcode = QR.createQrCodeImg(this.downloadUrl, {  
					size: parseInt(300)//二维码大小  
				});
				let px = this.px;
				//画背景图片
				let bgUrl = this.shareBg;
				ctx.save();
				ctx.beginPath();
				ctx.drawImage(bgUrl, 0, 0, 750*px, 1334*px);
				// 二维码
				let qrcodeX = 250*px;
				let qrcodeY = 700*px;
				let qrcodeS = 250*px;
				let qrcodeUrl = this.QRcode;
				// 绘制二维码背景白底
				ctx.beginPath();
				ctx.fillStyle = "#FFF";
				ctx.globalAlpha = 0.6;
				ctx.fillRect(qrcodeX - 10*px, qrcodeY - 10*px, qrcodeS + 20*px, qrcodeS + 20*px);
				// 绘制二维码
				ctx.globalAlpha = 0.8;
				ctx.drawImage(qrcodeUrl, qrcodeX, qrcodeY, qrcodeS, qrcodeS);
				// 绘制二维码下方文字
				ctx.globalAlpha = 1;
				ctx.setFontSize(24*px);
				ctx.fillStyle = "#FFF";
				ctx.fillText("长按识别二维码下载App", qrcodeX - 10*px, qrcodeY + qrcodeS + 50*px);
				
				ctx.restore();
				ctx.draw(true);
			},
			beforeShare(){
				this.showShare = true;
				if(!this.tempUrl){
					let _this = this;
					// let ctx = this.ctx;
					setTimeout(() => {
						ctx.draw(true, () => {
							console.log("drawn")
							uni.canvasToTempFilePath({
								canvasId: "canvasShare",
								success: (res) => {
									console.log("res", res);
									_this.tempUrl = res.tempFilePath;
								},
								complete: (res) => {
									console.log("complete", res);
								},
								fail: (err) => {
									let msg = "分享图片获取失败";
									if(typeof err === "object"){
										msg = JSON.stringify(err);
									}
									ut.showToast(msg);
								}
							}, this);
						});
					}, 100);
				}
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
		.canvas-wrap{
			width: 750upx;
			height: 0;
			overflow: hidden;
			.canvas-el{
				visibility: hidden;
				width: 750upx;
				height: 1334upx;
				margin: 0;
			}
		}
	}
</style>
