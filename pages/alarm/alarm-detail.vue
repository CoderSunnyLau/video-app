<template>
	<view class="alarm-detail alarm-history">
		<form>
			<view class="form-history">
				<view class="form-item form-item-border">
					<text class="form-label">开始时间</text>
					<view class="v-input" @click="showStart = true">
						<text v-if="fd.startTime">{{fd.startTime}}</text>
						<text v-else class="input-placeholder">请选择开始时间</text>
					</view>
				</view>
				<view class="form-item">
					<text class="form-label">结束时间</text>
					<view class="v-input" @click="showEnd = true">
						<text v-if="fd.endTime">{{fd.endTime}}</text>
						<text v-else class="input-placeholder">请选择结束时间</text>
					</view>
				</view>
			</view>
			<button class="btn-search" type="primary" @click="history(true, true)">查询</button>
		</form>
		<view class="list">
			<block v-for="(item, index) in historyList" :key="index">
				<v-img title="图片获取失败" :src="item.thumbUrl" @click="preview(item.sourceUrl)"></v-img>
			</block>
		</view>
		<v-loading :state="loadingState"></v-loading>
		<picker-date-pop v-model="showStart" title="开始时间" mode="dateTime" @change="dateChange($event, 'startTime')"></picker-date-pop>
		<picker-date-pop v-model="showEnd" title="结束时间" mode="dateTime" @change="dateChange($event, 'endTime')"></picker-date-pop>
	</view>
</template>

<script>
	import api from "@/api/alarm.js"
	import pickerDatePop from "@/components/form/picker-date/picker-date-pop.vue"
	import ut from "@/common/utils.js"
	import vLoading from "@/components/v-loading/v-loading.vue"
	import {basePicUrl} from "@/common/config.js"
	
	let imgList = [];
	
	export default {
		name: "alarm",
		data() {
			return {
				historyList: [],
				fd: {
					eq_id: "",
					startTime: "",
					endTime: "",
					pageNumber: 1
				},
				showStart: false,
				showEnd: false,
				loadingState: 0
			};
		},
		components: {pickerDatePop, vLoading},
// 		computed: {
// 			imgList(){
// 				let list = [];
// 				let arr = [...this.historyList];
// 				arr.forEach(item => {
// 					list.push(item.file_url || item.thumbnail_url);
// 				});
// 				return list;
// 			}
// 		},
		onLoad(options){
			let eq_id = options.eq_id;
			if(eq_id){
				this.fd.eq_id = eq_id;
				this.history(() => {
					let item = this.historyList[0];
					if(item && item.eq_name){
						uni.setNavigationBarTitle({
							title: item.eq_name + "告警历史"
						});
					}
				}, true);
			}else{
				this.loadingState = 3;
				ut.showToast("设备告警信息获取失败");
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
		onPullDownRefresh(){
			this.loadingState = 0;
			this.fd.pageNumber = 1;
			this.history(true, () => {
				ut.showToast("刷新成功");
			});
		},
		onReachBottom(){
			console.log("state", this.loadingState)
			if(this.loadingState === 0){
				this.fd.pageNumber++;
				this.history();
			}
		},
		methods: {
			history(refresh, callback){
				this.loadingState = 1;
				if(refresh === true){
					this.fd.pageNumber = 1;
				}
				if(callback === true) ut.showLoading();
				api.history(this.fd).then(res => {
					let dt = res.data;
					dt.list.map(item => {
						let tempUrl = `${basePicUrl}?img=${item.alarm_img_name}&chain=${item.chain}&type=`;
						item.sourceUrl = tempUrl + "source";
						item.thumbUrl = tempUrl + "thumbnail";
					});
					this.fd.pageNumber = dt.pageNumber;
					this.historyList = (dt.pageNumber === 1) ? dt.list : [...this.historyList, ...dt.list];
					this.loadingState = dt.lastPage ? 2 : 0;
					uni.stopPullDownRefresh();
					if(callback === true){
						uni.hideLoading();
					}else if(typeof callback === "function"){
						callback()
					}
					if(typeof refresh === "function") refresh();
				}).catch(err => {
					console.log("err", err);
					this.loadingState = 3;
					this.historyList = [];
					uni.stopPullDownRefresh();
				});
			},
			dateChange(e, param){
				this.$set(this.fd, param, e);
			},
			preview(url){
				uni.previewImage({
					urls: imgList,
					current: url
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "../../style/alarm-history.scss";
</style>