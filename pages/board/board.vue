<template>
	<view class="board">
		<!-- <view class="top" v-if="authority">
			<text>提醒事项</text>
			<v-icon type="plus-circle" size="40" :color="color" @click="add"></v-icon>
		</view> -->
		<view class="list-wrap">
			<view class="no-text grey" v-if="!list.length || loading === 3">
				<text v-if="loading === 3">加载错误，请重试</text>
				<text v-else-if="loading === 0 && !list.length">—— 暂无信息 ——</text>
			</view>
			<navigator :class="{'list-item': true, 'item-curr': index === currEdit}" v-for="(item, index) in list" :key="index" :url="page.boardDetail + '?rec_id=' + item.rec_id">
				<!-- <textarea v-if="index === currEdit" rows="3" v-model="list[index]" :disabled="index !== currEdit" :focus="index === currEdit" placeholder="请在此输入提醒事项"></textarea>
				<text v-else>{{item.title}}</text> -->
				<text>{{item.title}}</text>
				<!-- <view class="list-item-right" v-if="authority">
					<v-icon v-if="index !== currEdit" type="edit" :color="color" size="30" @click="edit(index)"></v-icon>
					<view v-else class="opts">
						<text @click="save(index)">完成</text>
						<text @click="cancel" class="btn-cancel">取消</text>
						<v-icon type="delete" color="#D00" @click="del(index)"></v-icon>
					</view>
				</view> -->
			</navigator>
		</view>
	</view>
</template>

<script>
	import ut from "@/common/utils.js"
	import api from "@/api/board.js"
	let timeTemp = 0;
	export default {
		data() {
			return {
				color: "#1c85ea",
				list: [],
				loading: 0
				// authority: true,
// 				currEdit: -1,  //当前编辑的项的索引
// 				isAdd: false  //当前状态为新增
			};
		},
		computed: {
			page(){
				return this.$page;
			}
		},
		mounted(){
			this.getList();
		},
		onPullDownRefresh(){
			this.getList(true);
		},
		methods: {
			getList(refresh){
				this.loading = 1;
				this.list = [];
				if(!refresh) ut.showLoading();
				api.query().then(res => {
					console.log("res", res);
					this.list = res.data;
					this.loading = 0;
					if(refresh){
						uni.stopPullDownRefresh();
						ut.showToast("刷新成功", "success");
					}else{
						uni.hideLoading();
					}
				}).catch(err => {
					this.loading = 3;
					uni.stopPullDownRefresh();
				});
			}
// 			edit(index){
// 				this.listener(index).then(() => {
// 					if(this.isAdd){
// 						this.isAdd = false;
// 						this.list.shift();
// 						clearTimeout(timeTemp);
// 						timeTemp = setTimeout(() => {
// 							this.currEdit = index - 1;
// 						}, 200);
// 					}else{
// 						this.currEdit = index;
// 					}
// 				}).catch(err => {});
// 			},
// 			save(index){
// 				// api.save(data)
// 				if(!this.list[index]){
// 					ut.showToast("内容不能为空");
// 					return;
// 				}
// 				this.currEdit = -1;
// 				ut.showToast("保存成功", "success");
// 			},
// 			add(){
// 				this.listener(-1).then(() => {
// 					if(this.isAdd){
// 						this.currEdit = -1;
// 						clearTimeout(timeTemp);
// 						timeTemp = setTimeout(() => {
// 							this.currEdit = 0;
// 						}, 200);
// 					}else{
// 						this.isAdd = true;
// 						this.list.unshift("");
// 						this.currEdit = 0;
// 					}
// 				}).catch(err => {});
// 			},
// 			cancel(){
// 				this.currEdit = -1;
// 				if(this.isAdd){
// 					this.list.shift();
// 					this.isAdd = false;
// 				}
// 			},
// 			del(index){
// 				uni.showModal({
// 					title: "提示",
// 					content: "您确定要删除该项吗？",
// 					success: (res) => {
// 						if(res.confirm){
// 							// 删除
// 						}
// 					}
// 				})
// 			},
// 			listener(index){  //index为-1时，为新增
// 				return new Promise((resolve, reject) => {
// 					if((this.currEdit > -1 && (this.currEdit !== index || index === -1)) && !(index === -1 && this.isAdd && this.currEdit === 0)){
// 						uni.showModal({
// 							title: "提示",
// 							content: "您还有编辑中的事项尚未保存，确定要放弃保存吗？",
// 							success: (res) => {
// 								if(res.confirm){
// 									// 确定
// 									resolve();
// 								}else{
// 									// 取消
// 									reject();
// 								}
// 							},
// 							fail: (err) => {
// 								reject();
// 							}
// 						});
// 					}else{
// 						resolve();
// 					}
// 				});
// 			}
		}
	}
</script>

<style lang="scss">
	$color: #1c85ea;
	page{
		background: #FFF;
	}
	.board{
		.no-text{
			padding: 40upx;
			text-align: center;
		}
		.top{
			height: 100upx;
			display: flex;
			justify-content: space-between;
			padding: 0 36upx;
			align-items: center;
			color: $color;
			border-bottom: 2upx solid #EEE;
		}
		.list-wrap{
			padding-top: 26upx;
			.list-item{
				display: flex;
				justify-content: space-between;
				position: relative;
				padding: 25upx 42upx 25rpx 72upx;
				border-bottom: 1px solid #EEE;
				&::before{
					content: "";
					display: block;
					width: 20upx;
					height: 20upx;
					background: $color;
					border-radius: 50%;
					position: absolute;
					left: 36upx;
					top: 32upx;
				}
				&.item-curr{
					background: #f2f8fe;
				}
				.list-item-right{
					width: 80upx;
					flex: none;
					display: flex;
					justify-content: flex-end;
					font-size: 26upx;
					padding-top: 5upx;
					.opts{
						display: flex;
						flex-direction: column;
						color: $color;
						position: relative;
						.btn-cancel{
							color: #999;
							margin-top: 20upx;
						}
						.v-icon-delete{
							position: absolute;
							bottom: 36upx;
							right: 3upx;
						}
					}
				}
			}
		}
	}
</style>
