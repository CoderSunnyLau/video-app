<template>
	<view class="picker-date-pop">
		<v-pop v-model="show" :title="title" @cancel="cancel" @confirm="confirm">
			<picker-date ref="pickerDate" :value="dateTemp" v-bind="$attrs"/>
		</v-pop>
	</view>
</template>

<script>
	import vPop from "@/components/modal/v-pop.vue"
	import pickerDate from "@/components/form/picker-date/picker-date.vue"
	
	export default {
		name: "pickerDatePop",
		data(){
			return {
				show: false,
				formerDate: [],  //记录原来的日期
				dateTemp: []  //设置日期
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			title: String
		},
		components: {vPop, pickerDate},
		watch: {
			value(val){
				this.show = val;
			},
			show(val){
				console.log("show", val);
				if(val === true){
					this.record();
				}
				this.$emit("input", val);
			}
		},
		methods: {
			cancel(){
				this.dateTemp = [...this.formerDate];
				// console.log("cancel", this.dateTemp);
			},
			confirm(){
				this.dateTemp = this.record();
				// console.log("confirm", this.$refs.pickerDate.getValue());
				this.$emit("change", this.$refs.pickerDate.getValue());
			},
			record(){
				let el = this.$refs.pickerDate;
				if(el){
					this.formerDate = el.getIndex();
				}
				// console.log("record", this.formerDate)
				return this.formerDate;
			}
		}
	}
</script>

<style>
</style>
