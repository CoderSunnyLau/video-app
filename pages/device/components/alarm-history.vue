<template>
	<scroll-view class="alarm-history" scroll-y :style="{height: height}" @scrolltolower="loadMore">
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
			<block v-for="(item, index) in historyList" :key="index">
				<!-- <v-img title="图片获取失败" :src="item.thumbnail_url || item.file_url" @click="preview(item.file_url || item.thumbnail_url)"></v-img> -->
				<v-img :src="item.thumbUrl" @click="preview(item.sourceUrl)"></v-img>
			</block>
		</view>
		<v-loading :state="loadingState"></v-loading>
	</scroll-view>
</template>

<script>
	import api from "@/api/device.js"
	import vLoading from "@/components/v-loading/v-loading.vue"
	import ut from "@/common/utils.js"
	import {basePicUrl} from "@/common/config.js"
	
	let imgList = [];
	
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
				loadingState: 0
			}
		},
		props: {
			eqId: {
				type: String,
				default: ""
			},
			height: {
				type: String,
				default: "330px"
			}
		},
		components: {vLoading},
		computed: {
			eqIdTemp(){
				if(this.firstLoad) this.history();
				return this.eqId;
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
		methods: {
			history(refresh){
				this.loadingState = 1;
				if(refresh === true){
					this.fd.pageNumber = 1;
				}
				ut.showLoading();
				this.fd.eq_id = this.eqId;
				api.history(this.fd).then(res => {
					let dt = res.data;
					dt.list.map(item => {
						let tempUrl = `${basePicUrl}?img=${item.alarm_img_name}&chain=${item.chain}&type=`;
						item.sourceUrl = tempUrl + "source";
						item.thumbUrl = tempUrl + "thumbnail";
					});
					this.historyList = (dt.pageNumber === 1) ? dt.list : [...this.historyList, ...dt.list];
					this.fd.pageNumber = dt.pageNumber;
					this.firstLoad = false;
					this.loadingState = dt.lastPage ? 2 : 0;
					uni.hideLoading();
				}).catch(err => {
					console.log("err", err);
					this.historyList = [];
					this.loadingState = 3;
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
			}
		}
	}
</script>

<style lang="scss">
	@import "../../../style/alarm-history.scss";
</style>
