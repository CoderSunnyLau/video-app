<template>
	<view class="alarm">
		<v-loading v-if="loadState !== 0" :state="loadState"></v-loading>
		<view class="alarm-li" v-for="(item, aIdx) in alarmList" :key="aIdx">
			<navigator class="top" :url="page.alarmDetail + '?eq_id=' + item.equipment">
				<view><text class="index">{{aIdx > 8 ? "" : "0"}}{{aIdx + 1}}</text><text>{{item.project_name}} {{item.eq_name}}发生告警信息</text></view>
				<v-icon type="more" size="34" color="#888"></v-icon>
			</navigator>
			<scroll-view scroll-x :scroll-y="false" style="height: 200upx;">
				<view class="img-ul">
					<v-img v-for="(img, iIdx) in item.children" :key="iIdx" :src="img.thumbUrl" @click="preview(aIdx, img.sourceUrl)"></v-img>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import api from "@/api/alarm.js"
	import ut from "@/common/utils.js"
	import {basePicUrl} from "@/common/config.js"
	import vLoading from "@/components/v-loading/v-loading.vue"
	
	let imgList = [];
	
	const arrEqual = (a, b) => {
		if(a.length !== b.length) return false;
		for(let index in a){
			let device = a[index];
			for(let key in device){
				let item = device[key];
				let item2 = b[index][key];
				if(key !== "children"){
					if(item !== item2){
						return false;
					}
				}else if(device["children"].length !== b[index]["children"].length){
					return false;
				}else{
					let children = device["children"];
					for(let index2 in children){
						let img = children[index2];
						let img2 = b[index]["children"][index2];
						if(img.alarm_img_name !== img2.alarm_img_name){
							return false;
						}
					}
				}
			}
		}
		return true;
	}
	
	export default {
		name: "alarm",
		data() {
			return {
				alarmList: [],
				firstLoad: true,
				loadState: 1
			};
		},
		computed: {
			page(){
				return this.$page;
			}
		},
		components: {vLoading},
		watch: {
			alarmList: {
				handler(val){
					let list = [];
					let arr = [...val];
					arr.forEach(item => {
						let children = [...item.children];
						if(children.length){
							children = children.map(child => {
								return child.sourceUrl;
							});
						}
						list.push(children);
					});
					imgList = list;
				},
				deep: true
			}
		},
		onPullDownRefresh(){
			this.load(() => {
				ut.showToast("刷新成功");
			});
		},
		onLoad(){
			this.load();
		},
		onShow(){
			if(!this.firstLoad) this.load();
		},
		methods: {
			load(callback){
				if(!this.alarmList.length) this.loadState = 1;
				api.queryCenter().then(res => {
					let dt = res.data;
					let isEqual = arrEqual(dt, this.alarmList);
					console.log("equal" + isEqual);
					if(!isEqual){
						dt.forEach(item => {
							let children = [...item.children];
							children.map(child => {
								let tempUrl = `${basePicUrl}?img=${child.alarm_img_name}&chain=${child.chain}&type=`;
								child.sourceUrl = tempUrl + "source";
								child.thumbUrl = tempUrl + "thumbnail";
								return child;
							});
						});
						this.alarmList = dt;
					}
					uni.stopPullDownRefresh();
					this.firstLoad = false;
					this.loadState = 0;
					if(typeof callback === "function") callback();
				}).catch(err => {
					console.log("err", err);
					uni.stopPullDownRefresh();
					this.firstLoad = false;
					this.loadState = 3;
				});
			},
			preview(index, url){
				uni.previewImage({
					urls: imgList[index],
					current: url
				});
			}
		}
	}
</script>

<style lang="scss">
	.alarm{
		.alarm-li{
			background-color: #FFF;
			margin: 7upx 0;
			padding: 38upx 48upx 52upx;
			.top{
				display: flex;
				justify-content: space-between;
				margin-bottom: 16upx;
				.v-icon{
					margin-top: 6upx;
				}
			}
			.index{
				background-color: #ff3c00;
				color: #FFF;
				padding: 0 16upx;
				line-height: 48upx;
				margin-right: 10upx;
			}
			.img-ul{
				width: 1830upx;
				height: 200upx;
				display: flex;
				.v-img{
					width: 356upx;
					height: 200upx;
					margin-right: 10upx;
				}
			}
		}
	}
</style>
