<template>
	<view class="v-input">
		<input :focus="focus_" :type="inputType" :value="value" @input="onInput" class="v-input-input" :placeholder="placeholder || (isPassword ? '请输入密码' : '')"
			 :password="isPassword&&!showPassword" @focus="onFocus" @blur="onBlur" :disabled="disabled" />
		<!-- 优先显示密码可见按钮 -->
		<v-icon v-if="!disabled&&!noClearable&&(value || value === 0)&&(isPassword ? noDisplayable : true)" type="clear" @click="clear"></v-icon>
		<v-icon v-if="!disabled&&isPassword&&!noDisplayable" :type="showPassword?'eye':'eye-close'" @click="display"></v-icon>
	</view>
</template>

<script>

	export default {
		name: "vInput",
		props: {
			type: String,  //输入类型
			value: String,  //值
			placeholder: String,  //占位符
			noClearable: {  //不显示清除按钮
				type: Boolean,
				default: false
			},
			noDisplayable: {  //不显示密码可见按钮
				type: Boolean,
				default: false
			},
			focus: {  //自动获取焦点
				type: [Boolean, String],
				default: false
			},
			password: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		model: {
			prop: "value",
			event: "input"
		},
		data() {
			return {
				/**
				 * 显示密码明文
				 */
				showPassword: false,
				/**
				 * 是否获取焦点
				 */
				isFocus: false
			}
		},
		computed: {
			inputType() {
				const type = this.type
				return type === "password" ? "" : type;
			},
			focus_() {
				return String(this.focus) !== "false";
			},
			isPassword(){
				let type = this.type;
				return (this.password || (type === "password"));
			}
		},
		methods: {
			clear() {
				this.value = "";
			},
			display() {
				this.showPassword = !this.showPassword;
			},
			onFocus() {
				this.isFocus = true;
			},
			onBlur() {
				this.$nextTick(() => {
					this.isFocus = false;
				});
			},
			onInput(e) {
				this.$emit("input", e.target.value);
			}
		}
	}
</script>