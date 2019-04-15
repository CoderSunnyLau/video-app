<template>
	<scroll-view class="alarm-info" scroll-y :style="{height: height}">
		<block v-if="imgList.length">
			<view>
				<image v-for="(item, index) in imgList" :key="index" :src="item" mode="aspectFit" @click="preview(index)"></image>
			</view>
			<text class="no-alarm">暂无更多</text>
		</block>
		<text class="no-alarm" v-else>暂无告警信息</text>
	</scroll-view>
</template>

<script>
	import {websocketUrl, basePicUrl} from "@/common/config.js"
	
	let timeoutTemp = 0;
	let timeoutCount = 0;
	let sourceList = [];  //原图列表
	export default {
		name: "alarmInfo",
		data(){
			return {
				socketTask: null,
				resList: [],
				connected: false
			}
		},
		props: {
			chain: String,
			height: String
		},
		computed: {
			imgList(){
				let arr = [...this.resList];
				let list = [];
				sourceList = [];
				if(arr.length){
					console.log("arr", arr, basePicUrl);
					arr.forEach(item => {
						let tempUrl = `${basePicUrl}?img=${item.alarm_img_name}&chain=${item.chain}&type=`;
						list.push(tempUrl + "thumbnail");
						sourceList.push(tempUrl + "source")
					});
				}
				return list;
			}
		},
		mounted(){
			this.initSocket();
		},
		beforeDestroy(){
			this.socketTask.close({code: 1000});
			clearTimeout(timeoutTemp);
		},
		destroyed(){
			this.$off();
			this.$destroy();
		},
		methods: {
			initSocket(){
				this.socketTask = uni.connectSocket({
					url: websocketUrl,
					data() {
						return {
						};
					},
					success: (res) => {
						console.log("success" + JSON.stringify(res));
					},
					fail: (err) => {
						console.log("fail" + JSON.stringify(err));
					}
				});
				this.socketOpen();
				this.socketErr();
				this.onSocketMsg();
				this.socketClose();
			},
			socketOpen(){
				this.socketTask.onOpen((res) => {
					this.connected = true;
					timeoutCount = 0;
					console.log("WebSocket连接已打开！" + JSON.stringify(res));
				});
			},
			socketErr(){
				this.socketTask.onError((res) => {
					this.reconnectSocket();
					console.log("WebSocket连接打开失败，请检查！" + JSON.stringify(res));
				});
			},
			onSocketMsg(){
				this.socketTask.onMessage((res) => {
					console.log("收到服务器内容：" + JSON.stringify(res));
// 					"data": {
// 						"alarm_img_name":"http://192.168.10.115:8080/alarmImg/getpic?img=9c5aaa9c600041ed83628033e1c807b4_zip.jpg&chain=1&type=thumbnail",
// 						"chain":"1",
// 						"eq_name":"监控一",
// 						"project_name":"220KV榄州变电站",
// 					};
					let dt = JSON.parse(res.data);
					if(dt && dt.chain === this.chain){  //如果返回的图片是当前设备的告警信息
						this.resList.unshift(dt);
					}
				});
			},
			socketClose(){
				this.socketTask.onClose((res) => {
					this.connected = false;
					console.log('WebSocket 已关闭！' + JSON.stringify(res));
					if(res.code !== 1000){
						this.reconnectSocket();
					}
				});
			},
			preview(index){
				uni.previewImage({
					current: index,
					urls: sourceList
				});
			},
			reconnectSocket(){
				if(!this.connected && timeoutCount < 5){
					console.log("连接断开，正在尝试重连..." + timeoutCount);
					clearTimeout(timeoutTemp);
					timeoutTemp = setTimeout(() => {
						timeoutCount++;
						this.initSocket();
					}, 5000);
				}
			}
		}
	}
</script>

<style lang="scss">
	.alarm-info{
		text-align: center;
		padding: 0 32upx;
		.img{
			width: 100%;
			height: 386upx;
			margin: 10upx auto;
		}
		.no-alarm{
			line-height: 80upx;
			color: #AAA;
		}
	}
</style>
