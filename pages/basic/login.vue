<template>
	<view class="login">
		<view class="login-wrap">
			<view class="logo">
				<image src="../../static/img/logo-igi.png" mode="aspectFit"></image>
				<text class="text-big">智能平台</text>
				<text class="text-small">Intelligent</text>
			</view>
			<form class="form">
				<f-item>
					<view class="login-input-icon"><v-icon type="phone" size="36"></v-icon></view>
					<v-input type="number" v-model="fd.userName" placeholder="请输入手机号码"></v-input>
				</f-item>
				<f-item>
					<view class="login-input-icon"><v-icon type="lock" size="36"></v-icon></view>
					<v-input v-model="fd.password" password displayable></v-input>
				</f-item>
				<view class="links">
					<navigator class="link-item nav-text" :url="page.register">注册账号</navigator>
					<navigator class="link-item nav-text" :url="page.forgetPassword">忘记密码</navigator>
				</view>
				<button type="primary" @click="formSubmit">登录</button>
			</form>
		</view>
	</view>
</template>

<script>
	import common from "@/api/common.js"
	import {mapState, mapMutations} from "vuex"
	import validate from "@/common/validate.js"
	import ut from "@/common/utils.js"

	export default {
		data() {
			return {
				providerList: [],
				hasProvider: false,
				fd: {
					userName: "",
					password: "",
					systemInfo: "",
					clientInfo: ""
				},
				systemInfo: {},
				rules: {
					userName: {required: true, message: "请输入手机号码"},
					password: [{required: true, message: "请输入密码"}]
				}
			}
		},
		computed: {
			page(){
				return this.$page;
			}
		},
		onLoad(){
			this.init();
		},
		methods: {
			init(){
				this.systemInfo = uni.getSystemInfoSync();
				this.fd.systemInfo = JSON.stringify(this.systemInfo);
				// #ifdef APP-PLUS
				this.fd.clientInfo = JSON.stringify(plus.push.getClientInfo());
				// #endif
				let loginData = uni.getStorageSync("loginData");
				console.log("loginData", loginData);
				if(loginData.userName){
					this.fd.userName = loginData.userName;
					console.log("loginData.userName" + loginData.userName + ",length:" + loginData.userName.length);
					if(loginData.password){
						this.fd.password = loginData.password;
						ut.showLoading("正在登录");
						setTimeout(this.login, 1000);
					}
				}
			},
			login() {
				console.log("loginData: " + JSON.stringify(this.fd));
				ut.showLoading("正在登录");
				common.login(this.fd).then(res => {
					if(res.loginInfo.loginCode === 1){
						let info = res.loginInfo;
						uni.setStorageSync("sessionId", info.sessionId);
						uni.setStorageSync("userInfo", info);
						uni.setStorageSync("loginData", this.fd);
						this.loginSuccess();
					}else{
						ut.showToast(res.loginInfo.loginMsg || "登录失败，请重试");
					}
				}).catch(err => {
					console.log(err.toString());
					console.log(JSON.stringify(err));
				});
			},
			loginSuccess(){
				ut.showToast("登录成功");
				uni.reLaunch({
					url: this.$page.index
				});
			},
			formSubmit(){
				let valid = validate(this.fd, this.rules);
				if(valid){
					this.login();
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "../../style/variable.scss";
	@import "../../static/img/login-bg.scss";
	.login{
		overflow: hidden;
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #312a4b;
		background-image: url($loginBg);
		background-size: 750upx auto;
		background-repeat: no-repeat;
		.login-wrap{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			padding: 0 75upx;
			box-sizing: border-box;
			background-color: rgba(54,50,74, 0.85);
		}
		.logo{
			margin: 200upx 0 100upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			color: #FFF;
			image{
				width: 120upx;
				height: 80upx;
				margin-bottom: 54upx;
			}
			.text-big{
				font-size: 50upx;
			}
			.text-small{
				font-size: 26upx;
				opacity: 0.5;
				// color: #AAA;
			}
		}
		.form{
			.form-item{
				height: 64upx;
				margin-top: 84upx;
				border-bottom: 1upx solid #818299;
				background: none;
			}
			.login-input-icon{
				$iconS: 36upx;
				width: $iconS;
				position: relative;
				z-index: 9;
				.v-icon{
					margin: -14upx 10upx 0 -20upx;
				}
			}
			input{
				color: #d0cce9;
			}
			.input-placeholder{
				color: #706e7d;
			}
			button[type=primary]{
				background-color: #4aadfb;
			}
		}
		.links{
			display: flex;
			justify-content: space-between;
			margin-bottom: 110upx;
			.link-item{
				color: $textColor;
				line-height: 88upx;
			}
		}
	}
</style>
