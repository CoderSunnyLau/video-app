<template>
	<view class="device-detail">
		<view class="video-wrap">
			<!-- #ifdef APP-PLUS -->
				<video class="video" id="myVideo" :src="dt.rstp_url" controls autoplay></video>
			<!-- #endif -->
			<!-- #ifndef APP-PLUS -->
				<live-player class="video" id="livePlayer" :src="dt.rstp_url" autoplay />
			<!-- #endif -->
		</view>
		<view class="tab">
			<button :class="{'tab-curr': currIdx === index}" type="text" v-for="(item, index) in ['告警信息', '告警历史', '项目详情']" :key="index" @click="currIdx = index">{{item}}</button>
		</view>
		<swiper class="swiper" :current="currIdx" :style="{height: swiperH}" @change="swiperChange">
			<swiper-item>
				<alarm-info :chain="dt.chain" :height="swiperH"></alarm-info>
			</swiper-item>
			<swiper-item>
				<alarm-history ref="alarmHistory" :eq-id="eq_id" :height="swiperH" @show-picker="showPicker"></alarm-history>
			</swiper-item>
			<swiper-item>
				<scroll-view class="project-info" scroll-y :style="{height: swiperH}">
					<!-- <text>项目名称：{{dt.project_name}}</text> -->
					<!-- <v-img src="http://igiweb.gzyaorui.cn/images/img-solution-03.b14d768.jpg"></v-img> -->
					<v-img :src="dt.src" title="项目平面图加载失败"></v-img>
					<!-- <text>{{dt.src}}</text> -->
				</scroll-view>
			</swiper-item>
		</swiper>
		<picker-date-pop v-model="showStart" title="开始时间" mode="dateTime" @change="dateChange($event, 'startTime')"></picker-date-pop>
		<picker-date-pop v-model="showEnd" title="结束时间" mode="dateTime" @change="dateChange($event, 'endTime')"></picker-date-pop>
	</view>
</template>

<script>
	import ut from "@/common/utils.js"
	import api from "@/api/device.js"
	import pickerDatePop from "@/components/form/picker-date/picker-date-pop.vue"
	import alarmInfo from "./components/alarm-info.vue"
	import alarmHistory from "./components/alarm-history.vue"
	import {baseRequestUrl} from "@/common/config.js"
	
	const baseImgUrl = baseRequestUrl + "file/getDeviceFile?fileId=";
	
	export default {
		name: "deviceDetail",
		data(){
			return {
				eq_id: "",
				dt: {
					chain: "",
					eq_name: "",
					rstp_url: "",
					videotype: "",
					src: ""
				},
				currIdx: 0,
				showStart: false,
				showEnd: false,
				videoH: 230,
				windowH: 603
			}
		},
		computed: {
			px(){
				return this.$store.state.px;
			},
			swiperH(){
				return `${(this.windowH - this.videoH - (92 * this.px) - 1)}px`;
			}
		},
		components: {alarmInfo, alarmHistory, pickerDatePop},
		onLoad(options){
			let eq_id = options.eq_id;
			if(eq_id){
				this.eq_id = eq_id;
				this.load();
			}else{
				ut.showToast("设备信息获取失败");
			}
		},
		mounted(){
			this.$nextTick(this.init);
		},
		methods: {
			init(){
				this.windowH = ut.getWindowHeight();
				ut.getElementFields(".video-wrap").then(res => {
					if(res && res.height){
						this.videoH = res.height;
					}
				});
			},
			load(){
				let _this = this;
				api.detail(this.eq_id).then(res => {
					let dt = res.data;
					dt.src = baseImgUrl + dt.project_url;
					_this.dt = dt;
					let eq_name = dt.eq_name;
					if(eq_name){
						uni.setNavigationBarTitle({
							title: eq_name
						});
					}
				}).catch(err => {
					console.log("err", err)
				});
			},
			swiperChange(e){
				this.currIdx = e.detail.current;
			},
			showPicker(arg){
				if(arg === "start"){
					this.showStart = true;
				}else{
					this.showEnd = true;
				}
			},
			dateChange(e, time){
				let el = this.$refs.alarmHistory;
				if(el){
					el.dateChange(e, time);
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "../../style/variable.scss";
	.device-detail{
		.video-wrap{
			background-color: #000;
			min-height: 400upx;
			.video{
				width: 100%;
				min-height: 400upx;
				background-color: #000;
			}
		}
		.tab{
			display: flex;
			border-bottom: $border;
			$tabH: 92upx;
			button{
				font-size: 30upx;
				height: $tabH;
				line-height: 86upx;
				color: #737373;
			}
			.tab-curr{
				color: $mainColor;
				border-bottom: 2px solid $mainColor;
			}
		}
		.project-info{
			padding: 32upx;
		}
	}
</style>
