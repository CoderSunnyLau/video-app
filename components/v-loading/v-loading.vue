<template>
	<view class="v-loading">
		<view class="loading-img" v-show="state === 1 && showImage">
			<view class="load1"><view v-for="i in 4" :key="i" :style="{background:color}"></view></view>
			<view class="load2"><view v-for="i in 4" :key="i" :style="{background:color}"></view></view>
			<view class="load3"><view v-for="i in 4" :key="i" :style="{background:color}"></view></view>
		</view>
		<text class="loading-text" :style="{color:color}">{{realText[state]}}</text>
	</view>
</template>

<script>
	export default {
		name: "vLoading",
		props: {
			state: {
				type: Number,
				default: 0  //0 待加载，1 加载中，2 加载完毕（加载完所有分页），3 加载错误
			},
			showImage: {
				type: Boolean,
				default: true
			},
			color: {
				type: String,
				default: "#BBB"
			},
			text: {
				type: Object,
				default(){
					return {};
				}
			}
		},
		computed: {
			realText(){
				let temp = this.text;
				let text = {
					"0": temp["0"] || "",
					"1": temp["1"] || "正在加载...",
					"2": temp["2"] || "没有更多数据了",
					"3": temp["3"] || "加载失败，请重试"
				};
				return text;
			}
		}
	}
</script>


<style scoped>
	.v-loading {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center;
	}
	.loading-img{
		height: 36upx;
		width: 36upx;
		margin-right:18upx;
	}
	.loading-text {
		font-size: 24upx;
		color: #777777;
	}

	.loading-img>view {
		position: absolute;
	}
	.load1,.load2,.load3 {
		height: 36upx;
		width: 36upx;
	}
	.load2 {
		transform: rotate(30deg);
	}

	.load3 {
		transform: rotate(60deg);
	}

	.loading-img>view view {
		width: 9upx;
		height: 3upx;
		border-top-left-radius: 1upx;
		border-bottom-left-radius: 1upx;
		background: #777;
		position: absolute;
		opacity: 0.2;
		transform-origin: 50%;
		-webkit-animation: load 1.56s ease infinite;
	}

	.loading-img>view view:nth-child(1) {
		transform: rotate(90deg);
		top:3upx;
		left:14upx;
	}

	.loading-img>view view:nth-child(2) {
		-webkit-transform: rotate(180deg);
		top:17upx;
		right:0upx;
	}

	.loading-img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom:3upx;
		left:14upx;
	}

	.loading-img>view view:nth-child(4) {
		top:17upx;
		left:0upx;
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s;
	}

	.load2 view:nth-child(1) {
		animation-delay: 0.13s;
	}

	.load3 view:nth-child(1) {
		animation-delay: 0.26s;
	}

	.load1 view:nth-child(2) {
		animation-delay: 0.39s;
	}

	.load2 view:nth-child(2) {
		animation-delay: 0.52s;
	}

	.load3 view:nth-child(2) {
		animation-delay: 0.65s;
	}

	.load1 view:nth-child(3) {
		animation-delay: 0.78s;
	}

	.load2 view:nth-child(3) {
		animation-delay: 0.91s;
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s;
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s;
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.30s;
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s;
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0.2;
		}
	}
</style>