<template>
	<view class="forget-password form">
		<form>
			<f-item label="手机号码">
				<v-input type="number" v-model="fd.mobile" placeholder="手机号码(11位数)"></v-input>
				<button class="btn-verify" @click="sendVerify" :disabled="verifyCountdown !== 0">发送验证码{{verifyCountdown ? "(" + verifyCountdown + "s)" : ""}}</button>
			</f-item>
			<f-item label="验证码">
				<v-input type="number" v-model="fd.verifyCode" placeholder="请输入短信验证码"></v-input>
			</f-item>
			<f-item label="新密码">
				<v-input type="password" v-model="fd.password" placeholder="请输入新密码, 长度6-18位"></v-input>
			</f-item>
			<f-item label="确认密码">
				<v-input type="password" v-model="fd.checkPassword" placeholder="请再次输入新密码"></v-input>
			</f-item>
			<view class="form-btn">
				<button type="primary" @click="formSubmit">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	import common from "../../api/common.js"
	import api from "@/api/user.js"
	import validate from "@/common/validate.js"
	import ut from "@/common/utils.js"
	
	let timeoutTemp = 0;
	
	export default {
		name: "forgetPassword",
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
					mobile: "",
					password: "",
					checkPassword: "",
					verifyCode: ""
				},
				rules: {
					mobile: [{required: true, message: "请输入手机号码"}, {type: "phone"}],
					verifyCode: {required: true, message: "请输入验证码"},
					password: [{required: true, message: "请输入新密码"}, {min: 6, max: 18, message: "密码长度为6-18位"}],
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
				let phoneValid = validate({mobile: this.fd.mobile}, {mobile: this.rules.mobile});
				if(phoneValid){
					this.verifyCountdown = 59;
					this.countdown();
					common.sendVerify(this.fd.mobile).then(res => {
						ut.showToast("验证码已发送");
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
				if(valid) this.forget();
			},
			forget(){
				ut.showLoading("正在提交");
				let reqData = {...this.fd};
				if(reqData.checkPassword) delete reqData.checkPassword;
				api.forgetPassword(reqData).then(res => {
					uni.setStorageSync("loginData", {userName: this.fd.mobile});  //密码重置后要清除缓存密码
					ut.navDelayBack("操作成功，请使用新密码登录");
				}).catch(err => {
					console.log("err" + err.toString());
				});
			}
		}
	}
</script>

<style lang="scss">
	.forget-password{
		.btn-verify{
			font-size: 26upx;
			width: 220upx;
			height: 70upx;
			line-height: 68upx;
			margin-left: 10upx;
		}
	}
</style>
