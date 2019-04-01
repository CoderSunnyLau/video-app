<template>
	<view class="register form">
		<form>
			<f-item label="手机号码">
				<v-input type="text" focus clearable v-model="fd.userName" :maxlength="11" placeholder="手机号码(11位数)"></v-input>
				<button class="btn-verify" @click="sendVerify" :disabled="verifyCountdown !== 0">发送验证码{{verifyCountdown ? "(" + verifyCountdown + "s)" : ""}}</button>
			</f-item>
			<f-item label="验证码">
				<v-input type="number" clearable v-model="fd.verifyCode" placeholder="请输入验证码"></v-input>
			</f-item>
			<f-item label="密码">
				<v-input type="password" displayable v-model="fd.password" placeholder="请设置密码"></v-input>
			</f-item>
			<f-item label="确认密码">
				<v-input type="password" displayable v-model="fd.checkPassword" placeholder="请再次输入密码"></v-input>
			</f-item>
			<view class="form-btn">
				<button type="primary" @click="formSubmit">注册</button>
			</view>
		</form>
	</view>
</template>

<script>
	import common from "@/api/common.js"
	import validate from "@/common/validate.js"
	import ut from "@/common/utils.js"
	
	let timeoutTemp = 0;

	export default {
		name: "register",
		data() {
			const validatecheckPassword = (value, rule) => {
				if(value === ""){
					return "请再次输入新密码";
				}else if(value !== this.fd.password){
					return "两次输入的新密码不一致";
				}
				return true;
			};
			return {
				fd: {
					userName: "",
					password: "",
					checkPassword: "",
					verifyCode: ""
				},
				rules: {
					userName: [{required: true, message: "请输入手机号"}, {type: "phone"}],
					verifyCode: {required: true, message: "请输入验证码"},
					password: [{required: true, message: "请输入密码"}, {min: 6, max: 18, message: "密码长度为6-18位"}],
					checkPassword: {validator: validatecheckPassword}
				},
				verifyCountdown: 0
			}
		},
		created() {
			ut.showLoading("请稍候");
			common.getSessionId().then(res => {
				let sessionId = res.sessionId;
				uni.setStorageSync("sessionId", sessionId);
				uni.hideLoading();
			});
		},
		methods: {
			sendVerify(){
				let phoneValid = validate({userName: this.fd.userName}, {userName: this.rules.userName});
				if(phoneValid){
				// if(true){
					this.verifyCountdown = 59;
					this.countdown();
					common.sendVerify(this.fd.userName).then(res => {
						ut.showToast("验证码已发送", "success");
					}).catch(err => {
						clearTimeout(timeoutTemp);
						this.verifyCountdown = 0;
					});
				}
			},
			countdown(){
				clearTimeout(timeoutTemp);
				timeoutTemp = setTimeout(() => {
					this.verifyCountdown--;
					if(this.verifyCountdown > 0) this.countdown();
				}, 1000);
			},
			formSubmit(){
				let valid = validate(this.fd, this.rules);
				if(valid) this.register();
			},
			register(){
				ut.showLoading("正在注册");
				common.register(this.fd).then(res => {
					console.log("register res"+JSON.stringify(res)); 
					ut.navDelayBack("注册成功，请等待管理员审核");
					// ut.showToast("注册成功，请等待管理员审核");
					// setTimeout(this.autoLogin, 1000);  // 自动登录
				}).catch(err => {
					console.log(JSON.stringify(err));
				});
			},
			autoLogin(){
				ut.showLoading("正在登录");
				let systemInfo =JSON.stringify(uni.getSystemInfoSync());
				let clientInfo = "";
				// #ifdef APP-PLUS
				clientInfo=JSON.stringify(plus.push.getClientInfo());
				// #endif
				let loginData = {...this.fd, clientInfo, systemInfo};
				console.log("loginData: " + JSON.stringify(loginData));
				common.login(loginData).then(res => {
					if(res.loginInfo.loginCode === 1){
						let info = res.loginInfo;
						uni.setStorageSync("sessionId", info.sessionId);
						uni.setStorageSync("userInfo", info);
						uni.setStorageSync("loginData", loginData);
						this.loginSuccess();
					}else{
						ut.showToast(res.loginInfo.loginMsg || "登录失败，请重试");
						this.loginFail();
					}
				}).catch(err => {
					this.loginFail();
				});
			},
			loginSuccess(){
				ut.showToast("登录成功", "success");
				uni.reLaunch({
					url: this.$page.device
				});
			},
			loginFail(){
				setTimeout(() => {
					uni.redirectTo({
						url: this.$page.login
					});
				}, 1000);
			}
		}
	}
</script>

<style lang="scss">
	.register{
		.btn-verify{
			font-size: 26upx;
			width: 220upx;
			height: 70upx;
			line-height: 68upx;
			margin-left: 10upx;
		}
	}
</style>
