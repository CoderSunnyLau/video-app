<template>
	<view class="alarm-detail alarm-history">
		<alarm-history ref="alarmHistory" :eq-id="eq_id" @show-picker="showPicker" @show-share="showShareFn" @url-change="setTempUrl"></alarm-history>
		<picker-date-pop v-model="showStart" title="开始时间" mode="dateTime" @change="dateChange($event, 'startTime')"></picker-date-pop>
		<picker-date-pop v-model="showEnd" title="结束时间" mode="dateTime" @change="dateChange($event, 'endTime')"></picker-date-pop>
		<v-share v-model="showShare" :imgUrl="tempUrl"></v-share>
	</view>
</template>

<script>
	import ut from "@/common/utils.js"
	import alarmHistory from "@/pages/device/components/alarm-history.vue"
	import pickerDatePop from "@/components/form/picker-date/picker-date-pop.vue"
	import vShare from "@/components/v-share/v-share.vue"
	
	export default {
		name: "alarm",
		data() {
			return {
				eq_id: "",
				showStart: false,
				showEnd: false,
				showShare: false,
				tempUrl: ""
			}
		},
		components: {alarmHistory, pickerDatePop, vShare},
		onLoad(options){
			let eq_id = options.eq_id;
			if(eq_id){
				this.eq_id = eq_id;
			}else{
				ut.showToast("设备告警信息获取失败");
			}
		},
		onPullDownRefresh(){
			this.$refs.alarmHistory.history(true, (success) => {
				uni.stopPullDownRefresh();
				if(success === true) ut.showToast("刷新成功", "success");
			});
		},
		onReachBottom(){
			this.$refs.alarmHistory.loadMore();
		},
		methods: {
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
			},
			showShareFn(val){
				this.showShare = val;
				console.log("val", val);
			},
			setTempUrl(val){
				console.log("urlChagne", val);
				this.tempUrl = val;
			}
		}
	}
</script>

<style lang="scss">
	@import "../../style/alarm-history.scss";
</style>