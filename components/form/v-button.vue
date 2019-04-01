<template>
		<button class="v-button" :type="type" :disabled="disabled || loading" :loading="loading" :open-type="openType" @click="onClick">
			<slot></slot>
		</button>
</template>

<script>
	export default {
		name: "vButton",
		data() {
			return {
				
			};
		},
		props: {
			disabled: {
				type: Boolean,
				default: false
			},
			openType: String,
			type: String,  //primary、default、disabled、none
			loading: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			onClick(e){
				this.$emit("click", e);
			}
		}
	}
</script>

<style>

</style>
