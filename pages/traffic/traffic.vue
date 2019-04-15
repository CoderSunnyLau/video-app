<template>
	<view class="traffic">
		<view class="row row1">
			<view class="row-title">通行量排名</view>
			<view class="row-cnt">
				<view class="table">
					<view class="tr" v-for="(item, index) in tableData" :key="index">
						<text class="td">{{index + 1}}</text>
						<text class="td">{{item.name}}</text>
						<text class="td">{{item.num}}</text>
						<text class="td">人次</text>
					</view>
				</view>
				<view class="tab-box">
					<view class="tab-wrap">
						<view class="tab-item">
							<text>当前进入人次</text><text class="text-blue">33</text>
						</view>
						<view class="tab-item">
							<text>当前离开人次</text><text class="text-blue">128</text>
						</view>
					</view>
					<view class="attendance">
						<text class="text-att">当日员工出勤率</text>
						<canvas canvasId="c-attendance" class="charts c-attendance"></canvas>
					</view>
				</view>
			</view>
		</view>
		<view class="row">
			<view class="row-title border-bottom">通行历史统计</view>
			<view class="row-cnt">
				<view class="time-sel">
					<view v-for="(item, index) in timeSel" :key="index" :class="{'time-item': true, 'time-curr': currTimeIdx === index}" @click="timeChange(index)">{{item}}</view>
				</view>
				<canvas canvasId="c-history" class="charts c-history" @touchstart="touchHistory"></canvas>
			</view>
		</view>
		<view class="row border-bottom">
			<view class="row-title">变电站区域监控</view>
			<view class="row-cnt">
				<view class="moni-wrap">
					<view class="moni-item" v-for="(item, index) in monitorData" :key="index">
						<v-icon type="person-round" size="100" :color="item.color"></v-icon>
						<text :style="{color: item.color}">{{item.num}}</text>
					</view>
				</view>
				<view class="row1 person-monitor">
					<view class="row-title">人员监控</view>
					<view class="auth-wrap">
						<view class="auth-item auth-tick">
							<v-icon type="tick-shield" color="#0F61CD" size="58"></v-icon><text>授权访问</text><text>{{moniAuth[0]}}</text>
						</view>
						<view class="auth-item auth-cross">
							<v-icon type="cross-shield" color="#82737F" size="58"></v-icon><text>非授权访问</text><text>{{moniAuth[1]}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import wxCharts from "@/components/wx-charts/wxcharts.js"
	
	let dataAttendance = {series:[{ name: '出勤', data: 50 }, { name: '缺勤', data: 30 }]};
	let dataHistory = {
		categories: ["18/08", "18/09", "18/10", "18/11", "18/12"],
		series: [
			{name: "员工", data: [35, 20, 25, 37, 4, 20]},
			{name: "访客", data: [70, 40, 65, 100, 44, 68]},
			{name: "陌生人", data: [100, 80, 95, 150, 112, 132]},
		]
	};
	let canvasHistory = null;
	export default {
		data() {
			return {
				tableData: [{
					name: "庄周变电站",
					num: 128
				}, {
					name: "庄周变电站2",
					num: 18
				}],
				fontSize: 23,
				monitorData: [{
					color: "#3C9220",
					num: 161
				}, {
					color: "#1668D7",
					num: 0
				}, {
					color: "#E88B52",
					num: 313
				}, {
					color: "#EE3229",
					num: 0
				}],
				moniAuth: [8, 0],
				timeSel: ["年", "月", "日"],
				currTimeIdx: 0
			};
		},
		mounted() {
			this.showAttendance("c-attendance", dataAttendance);
			this.showHistory("c-history", dataHistory);
		},
		computed: {
			px(){
				return this.$store.state.px;
			}
		},
		methods: {
			showAttendance(canvasId, chartData){
				let px = this.px;
// 				let w = uni.upx2px(750);
// 				let h = uni.upx2px(500);
				new wxCharts({
					canvasId: canvasId,
					type: "pie",
					fontSize: 18,
					// legend: false,
					// background: "#FFF",
					pixelRatio: 0.6,
					series: chartData.series,
					// animation: true,
					width: 680*px,
					height: 350*px,
					// dataLabel: true,
				});
			},
			showHistory(canvasId, chartData){
				let px = this.px;
				canvasHistory = new wxCharts({
					canvasId: canvasId,
					type: "line",
					fontSize: 12,
					// legend: true,
					// background:'#FFFFFF',
					pixelRatio: 0.8,
					categories: chartData.categories,
					// animation: true,
					series: chartData.series,
					xAxis: {
						// gridColor: "#000"
					},
					yAxis: {
						//disabled:true
					},
					width: 678*px,
					height: 480*px,
					// dataLabel: true,
					// dataPointShape: true
// 					extra: {
// 						lineStyle: "straight"
// 					}
				});
			},
			touchHistory(e){
				canvasHistory.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data 
					}
				});
			},
			timeChange(index){
				this.currTimeIdx = index;
				canvasHistory.updateData({});
			}
		}
	}
</script>

<style lang="scss">
	$border: 1px solid #E1E1E1;
	$timeCircleS: 45upx;
	$color: #186AD0;
	.traffic{
		.row{
			background: #FFF;
			margin-bottom: 17upx;
			.row-cnt{
				padding: 36upx;
			}
			.row-title{
				font-size: 30upx;
				line-height: 94upx;
				padding: 0 36upx;
				border-bottom: $border;
			}
		}
		.row1{
			.row-cnt{
				padding-top: 0;
			}
			.row-title{
				border: none;
			}
		}
		.table{
			border: $border;
			margin: 10upx 0;
			.tr{
				display: flex;
				justify-content: space-around;
				height: 100upx;
				align-items: center;
				border-bottom: $border;
				background: #f6fbff;
				&:last-child{
					border: none;
				}
			}
		}
		.tab-box{
			border: $border;
			margin: 22upx 0;
			.tab-wrap{
				border-bottom: $border;
				padding: 12upx 0;
				display: flex;
				justify-content: space-around;
				.tab-item{
					width: 49%;
					height: 72upx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #666;
					&:first-child{
						border-right: $border;
					}
					.text-blue{
						margin-left: 40upx;
						color: $color;
						font-weight: 600;
					}
				}
			}
			.attendance{
				position: relative;
				.text-att{
					color: #666;
					position: absolute;
					top: 42upx;
					left: 52upx;
				}
			}
		}
		.charts{
			width: 100%;
			&.c-attendance{
				height: 350upx;
			}
			&.c-history{
				height: 500upx;
			}
		}
		.time-sel{
			display: flex;
			justify-content: flex-end;
			margin-bottom: 20upx;
			.time-item{
				width: $timeCircleS;
				height: $timeCircleS;
				text-align: center;
				line-height: $timeCircleS;
				border: 1px solid $color;
				border-radius: 50%;
				color: $color;
				margin: 0 14upx;
				&.time-curr{
					color: #FFF;
					background: $color;
				}
			}
		}
		.moni-wrap{
			display: flex;
			justify-content: space-between;
			.moni-item{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				text{
					line-height: 60upx;
				}
			}
		}
		.person-monitor{
			.row-title{
				padding: 0;
			}
			.auth-wrap{
				display: flex;
				justify-content: space-around;
				.auth-item{
					display: flex;
					width: 250upx;
					justify-content: space-between;
					align-items: center;
					&.auth-tick{
						color: #0F61CD;
					}
					&.auth-cross{
						color: #82737F;
					}
				}
			}
		}
	}
</style>
