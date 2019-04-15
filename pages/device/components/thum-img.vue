<template>
	<image v-if="src && !error" class="v-img" :src="src" @click="onClick" :mode="mode" @error="error = true;" @longpress.stop="onLongpress"></image>
	<image v-else class="v-img" :src="defaultImg" :mode="mode"></image>
</template>

<script>
	export default {
		name: "thum-img",
		data(){
			return {
				error: false
			}
		},
		props: {
			src: String,
			mode: String,
			defaultImg: {
				type: "String",
				default: "/static/img/igi-default.jpg"
			}
		},
		methods: {
			onClick(e){
				this.$emit("click", e);
			},
			onLongpress(e){
				this.$emit("longpress", e);
			}
		}
	}
</script>