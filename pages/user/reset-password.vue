<template>
	<view class="reset-password form">
		<form>
			<f-item label="旧密码" required>
				<v-input type="password" v-model="fd.oldPassword" placeholder="请输入旧密码"></v-input>
			</f-item>
			<f-item label="新密码" required>
				<v-input type="password" v-model="fd.password" placeholder="请输入新密码, 长度6-18位"></v-input>
			</f-item>
			<f-item label="确认密码" required>
				<v-input type="password" v-model="fd.checkPassword" placeholder="请再次输入新密码"></v-input>
			</f-item>
			
			<!-- #ifndef APP-PLUS -->
				<view class="form-btn"><button type="primary" @click="formSubmit">完成</button></view>
			<!-- #endif -->
		</form>
	</view>
</template>

<script>
	import api from "@/api/user.js"
	import validate from "@/common/validate.js"
	import ut from "@/common/utils.js"
	
	export default {
		name: "resetPassword",
		data(){
			const validatecheckPassword = (value, rule) => {
				if(value === ""){
					return "请再次输入新密码";
				}else if(value !== this.fd.password){
					return "两次输入的新密码不一致";
				}
				return true;
			};
			const validatePassword = (value, rule) =>{
				if(value === this.fd.oldPassword){
					return "新密码不能和旧密码一样";
				}
				return true;
			}
			return {
				fd: {
					oldPassword: "",
					password: "",
					checkPassword: ""
				},
				rules: {
					oldPassword: {required: true, message: "请输入旧密码"},
					password: [{required: true, message: "请输入新密码"}, {min: 6, max: 18, message: "密码长度为6-18位"}, {validator: validatePassword}],
					checkPassword: {validator: validatecheckPassword}
				}
			}
		},
		onNavigationBarButtonTap(){
			this.formSubmit();
		},
		methods: {
			formSubmit(){
				let valid = validate(this.fd, this.rules);
				if(valid){
					this.save();
				}
			},
			save(){
				let fd = {...this.fd};
				if(fd.checkPassword) delete fd.checkPassword;
				ut.showLoading("正在提交");
				api.updatePassword(fd).then(res => {
					//密码重置后要清除缓存密码
					let loginData = uni.getStorageSync("loginData");
					if(loginData && loginData.userName){
						uni.setStorage({
							key: "loginData",
							data: {userName: loginData.userName}
						});
					}
					ut.navDelayBack(res.msg, "success");
				}).catch(err => {
				});
			}
		}
	}
</script>