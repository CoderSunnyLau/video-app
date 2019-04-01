<template>
	<view class="add-device">
		<view class="form">
			<f-item label="云ID">
				<v-input v-model="formData.chain" placeholder="请输入云ID" @input="chainInput"></v-input>
			</f-item>
			<f-item label="设备名称">
				<input v-model="formData.eq_name" :placeholder="chainLoading ? '加载中，请稍候' : '暂无设备'" disabled />
			</f-item>
			<f-item label="用户名">
				<v-input v-model="formData.chain_name" placeholder="请输入用户名"></v-input>
			</f-item>
			<f-item label="设备密码">
				<v-input v-model="formData.chain_password" placeholder="请输入设备密码" type="password"></v-input>
			</f-item>
			<!-- #ifndef APP-PLUS -->
				<view class="form-btn"><button type="primary" @click="formSubmit">完成</button></view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import api from "@/api/device.js"
	import validate from "@/common/validate.js"
	import ut from "@/common/utils.js"
	let getSimpleTemp = 0;
	export default {
		name: "addDevice",
		data() {
			return {
				formData: {
					eq_id: "",
					chain_password: "",
					chain_name: "",
					chain: "",
					eq_name: ""
				},
				chainLoading: false,
				rules: {
					chain: {required: true, message: "请输入云ID"},
					eq_id: {required: true, message: "未查找到设备，请核对云ID是否正确"},
					chain_name: [{required: true, message: "请输入用户名"}, {max: 50, message: "用户名长度不可超过50位"}],
					chain_password: [{required: true, message: "请输入设备密码"}, {max: 20, message: "密码长度不可超过20位"}]
				},
				saveLoading: false
			};
		},
		onNavigationBarButtonTap(){
			this.formSubmit();
		},
		methods: {
			save(){
				let fd = {...this.formData};
				let reqData = {
					eq_id: fd.eq_id,
					chain_password: fd.chain_password,
					chain_name: fd.chain_name
				};
				ut.showLoading("正在添加设备");
				api.save(reqData).then(res => {
					console.log("save res:", res);
					ut.showToast(res.msg, "success");
					this.$store.dispatch("updateDeviceList");  // 添加成功，更新一下设备列表
					setTimeout(uni.navigateBack, 1000);
				}).catch();
			},
			chainInput(e){
				clearTimeout(getSimpleTemp);
				getSimpleTemp = setTimeout(() => {
					this.getDeviceSimple();
				}, 500);
			},
			getDeviceSimple(){  //根据chain 云ID来获取设备名称等信息
				this.formData.eq_id = "";
				this.formData.eq_name = "";
				if(this.formData.chain){
					this.chainLoading = true;
					api.getByChain(this.formData.chain).then(res => {
						console.log("get res", res);
						if(res.data && res.data.eq_id){
							let dt = res.data;
							this.formData.eq_id = dt.eq_id;
							this.formData.eq_name = dt.eq_name || "未命名设备";
						}
						this.chainLoading = false;
					}).catch(err => {
						this.chainLoading = false;
					});
				}
			},
			formValidate(){
				return validate(this.formData, this.rules);
			},
			formSubmit(){
				let valid = this.formValidate();
				if(valid){
					this.save();
				}
			}
		}
	}
</script>

<style lang="scss">
	.add-device{
		overflow: hidden;
		.form{
			overflow: hidden;
		}
	}
</style>
