<template>
	<view class="modify-info form">
		<form>
			<f-item label="姓名" required>
				<v-input v-model="fd.NAME" placeholder="请输入姓名" no-clearable></v-input>
			</f-item>
			<f-item label="性别" required>
				<radio-group @change="(e) => {fd.SEX = e.detail.value}">
					<label class="label"><radio class="radio" value="1" :checked="fd.SEX == 1" /><text>男</text></label>
					<label class="label"><radio class="radio" value="2" :checked="fd.SEX == 2" /><text>女</text></label>
				</radio-group>
			</f-item>
			<f-item label="电话号码">
				<v-input v-model="fd.TELNO" placeholder="电话号码(带区号)/手机号(11位)"></v-input>
			</f-item>
			<f-item label="详细地址">
				<v-input v-model="fd.ADDRESS" placeholder="请输入详细地址"></v-input>
			</f-item>
			<f-item label="邮箱">
				<v-input v-model="fd.EMAIL" placeholder="请输入邮箱"></v-input>
			</f-item>
			<f-item label="邮政编码">
				<v-input v-model="fd.POSTCODE" placeholder="请输入邮政编码"></v-input>
			</f-item>
			
			<!-- #ifndef APP-PLUS -->
				<view class="form-btn"><button type="primary" @click="formSubmit">完成</button></view>
			<!-- #endif -->
		</form>
	</view>
</template>

<script>
	import {mapMutations} from "vuex"
	import api from "@/api/user.js"
	import ut from "@/common/utils.js"
	import validate from "@/common/validate.js"
	
	export default {
		name: "modifyInfo",
		data(){
			return {
				fd: {
					NAME: "",
					SEX: "",
					TELNO: "",
					PROVINCE: "",
					CITY: "",
					DISTRICT: "",
					ADDRESS: "",
					EMAIL: "",
					POSTCODE: "",
					USER_ID: ""
				},
				rules: {
					NAME: {required: true, message: "请输入姓名"},
					SEX: {required: true, message: "请选择性别"},
					TELNO: {type: "phone&tel"},
					EMAIL: {type: "email"},
					POSTCODE: {type: "postcode"}
				},
				showArea: true
			}
		},
		computed: {
			page(){
				return this.$page;
			}
		},
		mounted(){
			this.load();
		},
		onNavigationBarButtonTap(){
			this.formSubmit();
		},
		methods: {
			...mapMutations(["setName"]),
			load(){
				api.info().then(res => {
					this.fd = res.data;
				}).catch(err => {});
			},
			formSubmit(){
				let valid = validate(this.fd, this.rules);
				if(valid){
					this.save();
				}
			},
			save(){
				api.update(this.fd).then(res => {
					this.setName(this.fd.NAME);
					ut.navDelayBack("修改成功", "success");
				}).catch(err => {});
			},
			areaChange(e){
				console.log("e", e)
			}
		}
	}
</script>

<style lang="scss">
	.modify-info{
		.label{
			margin-right: 20upx;
			display: flex;
			align-items: center;
			float: left;
			width: 100upx;
		}
	}
</style>
