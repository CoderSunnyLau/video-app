<template>
	<view class="v-pop">
		<view class="bg" v-show="value" @click="onCancel"></view>
		<view :class="{box: true, 'box-show': value}">
			<view v-if="!noHeader" class="header">
				<button type="text" @click="onCancel">取消</button>
				<text v-if="title">{{title}}</text>
				<button class="btn-confirm" type="text" @click="onConfirm">确定</button>
			</view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "vPop",
		props: {
			value: {
				type: Boolean,
				default: false
			},
			title: String,
			noHeader: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			onCancel(){
				this.$emit("cancel");
				this.$emit("input", false);
			},
			onConfirm(){
				this.$emit("confirm");
				this.$emit("input", false);
			}
		}
	}
</script>


<style lang="scss">
	@import "../../style/variable.scss";
	.v-pop{
		$zIndex: 998;
		.bg{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
			z-index: $zIndex;
		}
		.box{
			position: fixed;
			bottom: 0;
			left: 0;
			width: 750upx;
			height: 600upx;
			overflow: hidden;
			max-height: 600upx;
			background-color: #FFF;
			z-index: $zIndex + 1;
			transition: transform 0.3s;
			transform: translateY(102%);
			&.box-show{
				transform: translateY(0);
			}
			.header{
				display: flex;
				justify-content: space-between;
				border-bottom: 1upx solid #EEE;
				height: 80upx;
				align-items: center;
				font-size: 30upx;
				button{
					color: #AAA;
					margin: 0;
					font-size: 28upx;
					padding: 0 30upx;
					&.btn-confirm{
						color: $textColor;
					}
				}
			}
		}
	}
</style>