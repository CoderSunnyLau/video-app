<template>
	<image v-if="src && !error" class="v-img" :src="src" @click="onClick" @error="error = true;"></image>
	<view v-else class="v-img no-img">
		<v-icon type="img-simple" :color="color" size="100"></v-icon>
		<text v-if="title" :style="{color: color}">{{title || "图片加载失败"}}</text>
	</view>
</template>

<script>
	export default {
		name: "vImg",
		data(){
			return {
				error: false
			}
		},
		props: {
			title: {
				type: String,
				default: "图片加载失败"
			},
			color: {
				type: String,
				default: "#888"
			},
			src: String
		},
		methods: {
			onClick(e){
				this.$emit("click", e);
			}
		}
	}
</script>