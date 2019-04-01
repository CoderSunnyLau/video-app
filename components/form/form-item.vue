<template>
	<view :class="{'form-item': true, 'form-item-border': !noBorder}">
		<view v-if="label" :class="{'form-label': true, 'form-label-required': required}">{{label}}</view>
		<!-- <v-icon v-if="icon" :type="icon"></v-icon> -->
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: "formItem",
		props: {
			label: String,
			noBorder: {
				type: Boolean,
				default: false
			},
			required: {
				type: Boolean,
				default: false
			}
		}
	}
</script>