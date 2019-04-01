<template>
	<view class="device">
		<view v-if="queryLoading !== 0"><v-loading :state="queryLoading"></v-loading></view>
		<view class="no-text grey" v-else-if="!list.length">暂无关注设备，您可以点击右上角添加设备。</view>
		<view class="pro-ul" v-for="(pro, pIdx) in list" v-if="pro.children.length" :key="pIdx">
			<text class="pro-name">项目：{{pro.name}}</text>
			<block v-for="(item, cIdx) in pro.children" :key="cIdx">
				<view class="nvr-wrapper" v-if="item.type == 2">
					<device-item :item="item.data" :type="item.type" @del="del" @trigger="trigger($event, item)"></device-item>
					<view :style="{height: item.hide ? 0 : (92 * px * item.children.length) + 'px'}">
						<device-item v-for="(device, dIdx) in item.children" v-if="item.children.length" :item="device.data" :type="device.type" :key="dIdx" @del="del"></device-item>
					</view>
				</view>
				<device-item v-else :item="item.data" :type="item.type" @del="del"></device-item>
			</block>
		</view>
		<!-- #ifndef APP-PLUS -->
			<view class="add-device"><button type="text" style="position:fixed;top:40%;right:0;width:80upx;height:80upx;border-radius:50%;line-height:74upx;font-size:60upx;color:#FFF;background-color:rgba(0,0,0,0.6);" @click="toAdd">＋</button></view>
		<!-- #endif -->
	</view>
</template>

<script>
	import deviceItem from "./components/device-item.vue"
	import vLoading from "@/components/v-loading/v-loading.vue"
	import ut from "@/common/utils.js"
	import {mapActions} from "vuex"
	import api from "@/api/device.js"
	
	export default {
		data() {
			let px = ut.getPx();
			return {
				queryLoading: 0,  //0 初始状态，1 加载中，2 加载完毕，3 加载错误
				px: px || 0.5
			};
		},
		computed: {
			page(){
				return this.$page;
			},
			list(){
				console.log("list", this.$store.state.deviceList);
				return this.$store.state.deviceList;
			}
		},
		components: {vLoading, deviceItem},
		onLoad(){
			this.load();
		},
		onPullDownRefresh(){  //无转圈圈
			this.query(() => {
				ut.showToast("刷新成功");
			});
		},
		onNavigationBarButtonTap(){
			this.toAdd();
		},
		methods: {
			...mapActions(["updateDeviceList"]),
			query(callback){
				this.updateDeviceList().then(res => {
					this.queryLoading = 0;
					uni.stopPullDownRefresh();
					if(typeof callback === "function") callback();
				}).catch(err => {
					this.queryLoading = 0;
					uni.stopPullDownRefresh();
				});
			},
			load(){  //会有转圈圈和文字提示
				this.queryLoading = 1;
				this.query();
			},
			del(eq_id){
				if(eq_id){
					uni.showModal({
						title: "提示",
						content: "您确定要取消对该设备的关注吗？",
						success: (res) => {
							if(res.confirm){
								ut.showLoading("正在取消关注");
								api.del(eq_id).then(res => {
									ut.showToast(res.msg, "success");
									this.load();  //更新设备列表
								}).catch();
							}
						}
					})
				}else{
					ut.showToast("获取不到设备id，无法取消关注");
				}
			},
			toAdd(){
				uni.navigateTo({
					url: this.page.addDevice
				});
			},
			trigger(show, item){
				console.log(item, show)
				this.$set(item, "hide", !show);
				// item.hide = show;
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#FFF;
	}
	$margin: 26upx;
	.device{
		background-color: #FFF;
		.pro-ul{
			overflow: hidden;
			margin-top: $margin;
			.nvr-wrapper{
				margin: $margin;
				background-color: #F2F2F2;
				overflow: hidden;
				.nvr{
					margin: 0;
				}
				.channel{
					margin: 0;
					padding-left: 80upx;
					border-top: 1px solid #DDD;
				}
			}
			.pro-name{
				margin-left: $margin;
				color: #999;
			}
			.device-li{
				display: flex;
				justify-content: space-between;
				padding: 0 36upx;
				background-color: #f2f2f2;
				margin: $margin;
				align-items: center;
				.info{
					line-height: 60upx;
					width: 448upx;
					.text{
						display: flex;
						.v-icon{
							margin: 0 20upx 0 6upx;
						}
					}
					.line{
						height: 0;
						border-bottom: 1px solid #DDD;
						width: 100%;
					}
				}
				.option{
					$buttonH: 50upx;
					button{
						width: 137upx;
						height: $buttonH;
						line-height: $buttonH;
						font-size: 24upx;
						margin: 20upx 0;
					}
				}
			}
			.btn-trigger{
				color: #555;
			}
		}
		.no-text{
			padding: 40upx;
		}
	}
</style>
