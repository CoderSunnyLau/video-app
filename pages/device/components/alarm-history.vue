<template>
	<view class="alarm-history">
		<form>
			<view class="form-history">
				<view class="form-item form-item-border">
					<text class="form-label">开始时间</text>
					<view class="v-input" @click="$emit('show-picker', 'start')">
						<text v-if="fd.startTime">{{fd.startTime}}</text>
						<text v-else class="input-placeholder">请选择开始时间</text>
					</view>
				</view>
				<view class="form-item">
					<text class="form-label">结束时间</text>
					<view class="v-input" @click="$emit('show-picker', 'end')">
						<text v-if="fd.endTime">{{fd.endTime}}</text>
						<text v-else class="input-placeholder">请选择结束时间</text>
					</view>
				</view>
			</view>
			<button class="btn-search" type="primary" @click="history(true)">查询</button>
		</form>
		<view class="list">
			<view v-if="historyList.length" class="share-tips">长按图片即可分享</view>
			<block v-for="(item, index) in historyList" :key="index">
				<v-img :src="item.thumbUrl" @click="preview(item.sourceUrl)" @longpress="beforeShare(item.thumbUrl)"></v-img>
			</block>
		</view>
		<v-loading :state="loadingState"></v-loading>
		<view class="canvas-wrap">
			<!-- <image :src="imgUrlTemp" mode="aspectFit"></image> -->
			<canvas canvas-id="canvasShare" class="canvas-el"></canvas>
		</view>
	</view>
</template>

<script>
	import api from "@/api/device.js"
	import vLoading from "@/components/v-loading/v-loading.vue"
	import ut from "@/common/utils.js"
	import QR from "@/common/qrcode.js" // 二维码生成器  
	
	let imgList = [];
	let ctx = null;
// 	let cw = 1024;
// 	let ch = 2000;
	let cw = 750;
	let ch = 1465;
	
	export default {
		name: "alarmHistory",
		data(){
			return {
				historyList: [],
				fd: {
					eq_id: "",
					startTime: "",
					endTime: "",
					pageNumber: 1
				},
				firstLoad: true,
				loadingState: 0,
				imgUrlTemp: ""
			}
		},
		props: {
			eqId: {
				type: String,
				default: ""
			}
		},
		components: {vLoading},
		computed: {
			eqIdTemp(){
				if(this.firstLoad) this.history();
				return this.eqId;
			},
			downloadUrl(){
				return this.$store.state.downloadUrl;
			},
			px(){
				return this.$store.state.px;
			}
		},
		watch: {
			historyList: {
				handler(val){
					let list = [];
					let arr = [...val];
					arr.forEach(item => {
						list.push(item.sourceUrl);
					});
					imgList = list;
				},
				deep: true
			}
		},
		mounted(){
			ctx = uni.createCanvasContext("canvasShare", this);
			this.initQRcode();
		},
		methods: {
			history(refresh, callback){
				this.loadingState = 1;
				if(refresh === true){
					this.fd.pageNumber = 1;
					this.historyList = [];
				}
				// ut.showLoading();
				this.fd.eq_id = this.eqId;
				api.history(this.fd).then(res => {
					let dt = res.data;
					dt.list.map(item => {
						let tempUrl = `${api.getPicUrl}?img=${item.alarm_img_name}&chain=${item.chain}&type=`;
						item.sourceUrl = tempUrl + "source";
						item.thumbUrl = tempUrl + "thumbnail";
					});
					this.historyList = (dt.pageNumber === 1) ? dt.list : [...this.historyList, ...dt.list];
					this.fd.pageNumber = dt.pageNumber;
					this.firstLoad = false;
					this.loadingState = dt.lastPage ? 2 : 0;
					// uni.hideLoading();
					if(typeof callback === "function") callback(true);
				}).catch(err => {
					console.log("err", err);
					this.historyList = [];
					this.loadingState = 3;
					if(typeof callback === "function") callback(false);
				});
			},
			loadMore(){
				console.log("state", this.loadingState)
				if(this.loadingState === 0){
					this.fd.pageNumber++;
					this.history();
				}
			},
			dateChange(e, param){
				this.$set(this.fd, param, e);
			},
			preview(url){
				uni.previewImage({
					urls: imgList,
					current: url
				});
			},
			initQRcode(){
				this.QRcode = QR.createQrCodeImg(this.downloadUrl, {  
					size: parseInt(300)//二维码大小  
				});
				// this.beforeShare("http://ais.igiai.com/app/file/getPic?img=74b8677a60d843938c5be176b853eaa3.jpg&chain=1674162283&type=thumbnail");
			},
			beforeShare(url){
				this.$emit("show-share", true);
				uni.getImageInfo({
					src: url,
					success: (image) => {
						console.log(image);
						console.log(image.height);
						this.draw(image);
					}
				});
			},
			draw(image){
				let side = cw/35;  //边距
				// 先清除画布
				ctx.clearRect(0, 0, cw, ch);
				ctx.save();
				// 白色背景
				ctx.beginPath();
				ctx.fillStyle = "#FFF";
				ctx.fillRect(0, 0, cw, ch);
				//画背景图片
				let bgUrl = image.path;
				let bgH = (cw / image.width) * image.height;
				ctx.beginPath();
				ctx.drawImage(bgUrl, 0, 0, cw, bgH);
				// 绘制二维码
				let qrcodeS = parseInt(cw / 7);
				let qrcodeX = side*2;
				let qrcodeY = bgH + side;
				let qrcodeUrl = this.QRcode;
				ctx.drawImage(qrcodeUrl, qrcodeX, qrcodeY, qrcodeS, qrcodeS);
				// 绘制文字
				let textX = qrcodeS + qrcodeX + side*2;
				ctx.setFontSize(cw/40);
				ctx.fillStyle = "#000";
				ctx.fillText("扫描或长按识别图中二维码下载App", textX, qrcodeY + side*3);
				ctx.fillText("可查看更多设备告警详情", textX, qrcodeY + side*3.5 + side);
				
				ctx.restore();
				// ctx.draw(true);
				setTimeout(() => {
					let _this = this;
					let imgH = qrcodeY + qrcodeS + side;
					console.log("imgH", bgH, qrcodeY, qrcodeS, side, imgH);
					ctx.draw(true, () => {
						console.log("drawn")
						uni.canvasToTempFilePath({
							canvasId: "canvasShare",
							width: cw,
							height: imgH,
							success: (res) => {
								console.log("res", res);
								// _this.tempUrl = res.tempFilePath;
								_this.$emit("url-change", res.tempFilePath);
								_this.imgUrlTemp = res.tempFilePath;
							},
							complete: (res) => {
								console.log("complete", res);
							},
							fail: (err) => {
								let msg = "分享图片获取失败";
								if(typeof err === "object"){
									msg = JSON.stringify(err);
								}
								ut.showToast(msg);
							}
						}, this);
					});
				}, 300);
			}
		}
	}
</script>

<style lang="scss">
	@import "../../../style/alarm-history.scss";
</style>
