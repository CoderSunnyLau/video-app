<template>
	<view 
		class="v-icon" 
		:class="['v-icon-' + type]" 
		:style="(color ? ('color:' + color + ';') : '') + (fontS ? ('font-size:' + fontS + ';width:' + fontS + ';height:' + fontS + ';') : '')" 
		@click="onClick"></view>
</template>

<script>
	export default {
		props: {
			/**
			 * 图标类型
			 */
			type: String,
			/**
			 * 图标颜色
			 */
			color: String,
			/**
			 * 图标大小
			 */
			size: {
				type: [Number, String],
				default: ""
			}
		},
		computed: {
			fontS() {
				let size = Number(this.size);
				if(this.size && !isNaN(size)){
					return `${size*this.px}px`;
				}else{
					return "";
				}
			},
			px(){
				return this.$store.state.px || 0.5;
			}
		},
		methods: {
			onClick() {
				this.$emit("click")
			}
		}
	}
</script>

<style lang="scss">
	@import "./v-icon.scss";
</style>
