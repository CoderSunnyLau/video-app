<template>
	<view class="user-audit">
		<view>
			<view class="user-li" v-for="(item, index) in list" :key="index">
				<view class="info">
					<view class="name">
						<!-- <v-icon v-if="item.SEX == 1" type="male" color="#4aadfb"></v-icon>
						<v-icon v-else-if="item.SEX == 2" type="female" color="#ff6d9b"></v-icon> -->
						<text class="ellipsis">{{item.USER_NAME || ""}}</text>
					</view>
				</view>
				<view class="option">
					<button @click="beforeRefuse(item.USER_ID)">拒绝</button>
					<button type="primary" @click="beforePass(item.USER_ID)">通过</button>
				</view>
			</view>
		</view>
		<v-loading :state="loadingState"></v-loading>
		<sel-role ref="selRole" @selected="(USER_ID, list) => {audit('1', USER_ID, list)}"></sel-role>
	</view>
</template>

<script>
	import api from "@/api/audit.js"
	import vLoading from "@/components/v-loading/v-loading.vue"
	import selRole from "./components/select-role.vue"
	import ut from "@/common/utils.js"
	
	export default {
		name: "userAudit",
		data(){
			return {
				loadingState: 0,
				list: [],
				fd: {
					pageNumber: 1
				}
			}
		},
		components: {vLoading, selRole},
		mounted(){
			this.load(true);
		},
		onPullDownRefresh(){
			this.load(true, () => {
				ut.showToast("刷新成功");
			});
		},
		onReachBottom(){
			if(this.loadingState === 0){
				this.fd.pageNumber++;
				this.load();
			}
		},
		methods: {
			load(refresh, callback){
				if(refresh === true){
					this.fd.pageNumber = 1;
				}
				this.loadingState = 1;
				api.getUserList(this.fd).then(res => {
					let dt = res.data;
					this.fd.pageNumber = dt.pageNumber;
					this.list = dt.pageNumber === 1 ? dt.list : [...this.list, dt.list];
					this.loadingState = dt.lastPage ? 2 : 0;
					uni.stopPullDownRefresh();
					callback = callback || refresh;
					if(typeof callback === "function") callback();
				}).catch(err => {
					this.list = [];
					this.loadingState = 3;
					uni.stopPullDownRefresh();
				});
			},
			audit(audit, USER_ID, codeString){
				ut.showLoading("正在提交");
				let reqData = {audit, USER_ID};
				if(audit == 1){
					reqData.codeString = codeString.join(",");
				}
				api.audit(reqData).then(res => {
					ut.showToast(res.msg, "success");
					this.load(true);
				}).catch(err => {});
			},
			beforeRefuse(USER_ID){
				let _this = this;
				uni.showModal({
					title: "提示",
					content: "您确定要拒绝该用户的审核请求吗？",
					success: res => {
						if(res.confirm) _this.audit("2", USER_ID);
					}
				});
			},
			beforePass(USER_ID){
				this.$refs.selRole.show(USER_ID);
			}
		}
	}
</script>

<style lang="scss">
	.user-audit{
		.user-li{
			background: #FFF;
			margin: 20upx;
			padding: 24upx 32upx;
			overflow: hidden;
		}
		.info{
			float: left;
			.name{
				font-size: 28upx;
				display: flex;
				align-items: center;
				width: 400upx;
				margin-bottom: 20upx;
			}
		}
		.option{
			float: right;
			display: flex;
			width: 200upx;
			justify-content: space-between;
			flex: none;
			button{
				font-size: 24upx;
				width: 90upx;
				height: 60upx;
				line-height: 58upx;
				margin: 0;
			}
		}
	}
</style>
