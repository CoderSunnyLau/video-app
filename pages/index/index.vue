<template>
	<view class="index">
		<view class="bg-mask"></view>
		<image class="top-img" src="../../static/img/index-bg1.jpg"></image>
		<view class="cnt">
			<navigator class="menu-item" :url="item.url" v-for="(item, index) in menu" :key="index">
				<view class="menu-circle">
					<v-icon :type="item.icon" color="#FFF" size="60"></v-icon>
					<text>{{item.title}}</text>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menu: [{
					title: "安全监护",
					icon: "monitor2",
					url: this.$page.device
				},{
					title: "环境监测",
					icon: "monitor-round",
					url: this.$page.environment
				},{
					title: "智能通行",
					icon: "car",
					url: this.$page.traffic
				},{
					title: "今日看板",
					icon: "monitor3",
					url: this.$page.board
				}]
			};
		}
	}
</script>

<style lang="scss">
	@import "~@/static/img/index-bg2.scss";
	$border: 1px solid rgba(34, 139, 238, 0.5);
	$circleS: 156upx;
	$imgH: 400upx;
	page{
		background: #325477 url($indexBg2) no-repeat fixed bottom center;
		background-size: contain;
	}
	.index{
		height: 100%;
		.bg-mask{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(40, 72, 133, 0.9);
			z-index: -1;
		}
		.top-img{
			width: 750upx;
			height: $imgH;
		}
		.cnt{
			padding: 55upx 68upx;
			overflow: hidden;
			.menu-item{
				box-sizing: border-box;
				width: 306upx;
				height: 290upx;
				float: left;
				display: flex;
				&:first-child{
					.menu-circle{
						background: #228bee;
					}
				}
				&:nth-child(2){
					border-left: $border;
					justify-content: flex-end;
					.menu-circle{
						background: rgba(255,153,0, 0.7);
					}
				}
				&:nth-child(3){
					border-top: $border;
					align-items: flex-end;
					.menu-circle{
						background: rgba(244,98,98, 0.8);
					}
				}
				&:last-child{
					border-top: $border;
					border-left: $border;
					justify-content: flex-end;
					align-items: flex-end;
					.menu-circle{
						background: rgba(106,186,41, 0.8);
					}
				}
				.menu-circle{
					width: $circleS;
					height: $circleS;
					border-radius: 50%;
					// border: 1px solid #228bee;
					color: #FFF;
					margin: 40upx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					text{
						font-size: 22upx;
						margin-top: 12upx;
					}
				}
			}
		}
	}
</style>
