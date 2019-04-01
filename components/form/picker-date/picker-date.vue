<template>
	<view class="picker-date width100">
		<picker-view v-if="refresh" class="fontColor666666 width100 picker-view" :indicator-style="indicatorStyle||''" :value="dateVlue"
		 @change="bindPickerViewChange($event)" :style="{'height': height||'', 'font-size': fontSize+'px'}">
			<block v-if="mode!=time">
				<picker-view-column>
					<view class="flex_row_c_c" v-for="(picker_item,picker_index) in years" :key="picker_index">{{picker_item}}年</view>
				</picker-view-column>
				<picker-view-column>
					<view class="flex_row_c_c" v-for="(picker_item,picker_index) in months" :key="picker_index">{{picker_item}}月</view>
				</picker-view-column>
				<picker-view-column>
					<view class="flex_row_c_c" v-for="(picker_item,picker_index) in days" :key="picker_index">{{picker_item}}日</view>
				</picker-view-column>
			</block>
			<block v-if="mode!=date">
				<picker-view-column>
					<view class="flex_row_c_c" v-for="(picker_item,picker_index) in Hours" :key="picker_index">{{picker_item}}时</view>
				</picker-view-column>
				<picker-view-column>
					<view class="flex_row_c_c" v-for="(picker_item,picker_index) in minutes" :key="picker_index">{{picker_item}}分</view>
				</picker-view-column>
				<picker-view-column>
					<view class="flex_row_c_c" v-for="(picker_item,picker_index) in seconds" :key="picker_index">{{picker_item}}秒</view>
				</picker-view-column>
			</block>
		</picker-view>
	</view>
</template>

<script>
	let valTemp = "";
	export default {
		name: "pickerDate",
		props: {
			indicatorStyle: String,
			height: String,
			defaultDate: {
				type: Date,
				default: new Date()
			},
			mode: {
				type: String,
				default: 'date'
			},
			fontSize: {
				type: Number,
				default: 10
			},
			startYear: {
				type: Number,
				default: new Date().getFullYear() - 20
			},
			endYear: {
				type: Number,
				default: new Date().getFullYear()
			},
			value: {
				type: Array,
				default(){
					return [];
				}
			}
		},
		data() {
			let _this = this;
			const dateTime = 'dateTime';
			const date = 'date';
			const time = 'time';
			let months = [];
			for (let i = 1; i <= 12; i++) {
				months.push(i);
			}
			let years = this.getYearsArray(this.startYear, this.endYear);
			let thisYear = years;
			let endYear = thisYear[thisYear.length - 1];
			let defaultYear = _this.defaultDate.getFullYear();
			let defaultMonth = _this.defaultDate.getMonth() + 1;
			let defaultDay = _this.defaultDate.getDate();
			let defaultHour = _this.defaultDate.getHours();
			let defaultMinute = _this.defaultDate.getMinutes();
			let defaultSecond = _this.defaultDate.getSeconds();
			let year = endYear > defaultYear ? defaultYear : endYear;
			let month = endYear >= defaultYear ? defaultMonth : months[0];
			let days = _this.changeDays(year, month, false, endYear > defaultYear, defaultDay, date, time, defaultHour, defaultMinute, defaultSecond);
			let day = endYear >= defaultYear ? defaultDay : days[0];
			let Hours = [];
			let minutes = [];
			let seconds = [];
			let dateVlue = [];
			if (_this.mode != time) {
				for (let i = 0; i < thisYear.length; i++) {
					if (year == thisYear[i]) {
						dateVlue[0] = i;
					}
				}
				dateVlue[1] = month - 1;
				dateVlue[2] = day - 1;
			}
			if(_this.mode != date){
				for (let i = 0; i <= 24; i++) {
					Hours.push(i);
				}
				for (let i = 0; i <= 60; i++) {
					minutes.push(i);
					seconds.push(i);
				}
				if (_this.mode == time) {
					dateVlue[0] = defaultHour;
					dateVlue[1] = defaultMinute;
					dateVlue[2] = defaultSecond;
				} else {
					dateVlue[3] = defaultHour;
					dateVlue[4] = defaultMinute;
					dateVlue[5] = defaultSecond;
				}
			}
			return {
				months,
				days,
				Hours,
				minutes,
				seconds,
				dateVlue,
				dateTime,
				date,
				time,
				years,
				windowHeight: 0,
				// formatValue: "",
				refresh: true
			}
		},
		watch: {
			value: {
				handler(val){
					if(val.length){
						this.refresh = false;
						this.$nextTick(() => {
							this.refresh = true;
							this.dateVlue = val;
						});
					}
				},
				deep: true
			}
		},
		mounted(){
			this.$nextTick(() => {
				let val = this.dateVlue;
				this.changeDays(this.years[val[0]], this.months[val[1]], val);
			});
		},
		methods: {
			bindPickerViewChange(e) {
				const val = e.detail.value
				this.dateVlue = val;
				this.changeDays(this.years[val[0]], this.months[val[1]], val);
			},
			changeDays(Y, M, val, compare, defaultDay, d, t, H, m, s) {
				let _this = this;
				let mode = _this.mode;
				let date = _this.date || d;
				let time = _this.time || t;
				let today = new Date();
				let days = [];
				today.setFullYear(Y);
				today.setMonth(M);
				today.setDate(0);
				for (let i = 1; i <= today.getDate(); i++) {
					days.push(i);
				}
				// console.log(JSON.stringify(days));
				if(_this.days != days)
					_this.days = days;
					
				
				let MM = _this.formatTime(M);
				let DD = 0;
				let hh = 0;
				let mm = 0;
				let ss = 0;
				if (val) {
					let commitDay = null;
					if(mode!=time) {
						if (val[2] + 1 < days[days.length - 1]) {
							commitDay = val[2] + 1;
						} else {
							commitDay = days[days.length - 1];
						}
					}
					DD = _this.formatTime(commitDay);
					hh = _this.formatTime(mode == time ? val[0] : val[3]);
					mm = _this.formatTime(mode == time ? val[1]: val[4]);
					ss = _this.formatTime(mode == time ? val[2] : val[5]);
				} else {
					DD = _this.formatTime(compare?defaultDay:days[days.length-1]);
					hh = _this.formatTime(H);
					mm = _this.formatTime(m);
					ss = _this.formatTime(s);
				}
				valTemp = mode == date ? `${Y}-${MM}-${DD}` : mode == time ? `${hh}:${mm}:${ss}` : `${Y}-${MM}-${DD} ${hh}:${mm}:${ss}`;
				// console.log("change format value", valTemp);
				_this.$emit('change', valTemp);
				return !val?days:'';
			},
			getYearsArray(sy, ey) {
				let y = [];
				let c = ey - sy;
				for (let i = 0; i <= c; i++) {
					y.push(sy + i);
				}
				return y;
			},
			formatTime(t){
				t = parseInt(t);
				t = t > 9 ? t : "0" + t;
				return t;
			},
			getValue(){
				// console.log("this.getVal", valTemp)
				return valTemp;
			},
			getIndex(){
				return [...this.dateVlue];
			}
		}
	}
</script>

<style scoped>
	.width100 {
		width: 100%;
	}
	.flex_row_c_c {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.fontColor666666 {
		color: #666666;
	}
	.picker-view{
		height: 510upx;
	}
</style>