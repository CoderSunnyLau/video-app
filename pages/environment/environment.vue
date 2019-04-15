<template>
	<view class="environment">
		<view class="list-wrap">
			<view class="list-item" v-for="(item, key) in listData" :key="key">
				<view class="item-icon"><v-icon :type="item.icon" color="#1466E8" size="62"></v-icon></view>
				<text>{{item.title}}：{{item.value || "--"}}{{item.unit}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import api from "@/api/environment.js"
	import ut from "@/common/utils.js"
	export default {
		data() {
			return {
				listData: {
					pm: {
						title: "PM2.5",
						value: "",
						unit: "ug/m³",
						icon: "pm"
					},
					electric: {
						title: "电量",
						value: "",
						unit: "%",
						icon: "battery"
					},
					temperature: {
						title: "温度",
						value: "",
						unit: "℃",
						icon: "thermometer"
					},
					humidity: {
						title: "湿度",
						value: "",
						unit: "%",
						icon: "humidity"
					},
					windspeed: {
						title: "风速",
						value: "",
						unit: "m/s",
						icon: "wind"
					},
					dip: {
						title: "倾角",
						value: "",
						unit: "°",
						icon: "angle"
					}
				}
			};
		},
		onLoad(){
			this.getList();
		},
		onPullDownRefresh(){
			this.getList(true);
		},
		methods: {
			getList(refresh){
				if(!refresh) ut.showLoading();
				api.query().then(res => {
					console.log(res);
					let dt = res.data;
					if(dt){
						let list = {...this.listData};
						for(let name in list){
							let item = list[name];
							item["value"] = dt[name];
						}
						this.listData = {...list};
					}
					uni.hideLoading();
					if(refresh){
						uni.stopPullDownRefresh();
						ut.showToast("刷新成功", "success");
					}
				}).catch(err => {
					console.log("err", err);
					if(refresh) uni.stopPullDownRefresh();
				});
			}
		}
	}
</script>

<style lang="scss">
	$circleS: 124upx;
	$color: #1466E8;
	page{
		background: #FFF;
	}
	.environment{
		.list-wrap{
			.list-item{
				float: left;
				width: 50%;
				height: 310upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				flex-direction: column;
				text{
					line-height: 80upx;
					color: $color;
				}
			}
			.item-icon{
				width: $circleS;
				height: $circleS;
				border: 2px solid $color;
				background: #F5FAFF;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>
