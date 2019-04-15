<template>
	<checkbox-group @change="checkChange">
	<view class="device-item">
		<view class="device-img" v-if="!selection">
			<thum-img :src="item.eq_img_url" mode="aspectFill"></thum-img>
		</view>
		<view class="device-li" :class="{nvr: type == 2, channel: type == 3}">
			<view class="info">
				<block v-if="type != 3">
					<view class="text">
						<v-icon type="id" size="32" color="#0096fa"></v-icon>
						<text class="ellipsis">云ID：{{item.chain}}</text>
					</view>
					<view class="line"></view>
				</block>
				<view class="text">
					<v-icon type="monitor" size="32" color="#0096fa"></v-icon>
					<text class="ellipsis">{{type == 2 ? "nvr" : (type == 3 ? "通道" : "设备")}}：{{item.eq_name || item.name}}</text>
				</view>
			</view>
			<view class="option" v-if="!selection">
				<button v-if="type != 3" @click="del(item.eq_id)" type="default">取消关注</button>
				<navigator v-if="type != 2" :url="page.deviceDetail + '?eq_id=' + item.eq_id"><button type="primary">查看详情</button></navigator>
				<button v-else class="btn-trigger" @click="trigger">{{showMore ? "收起" : "展开"}}通道</button>
			</view>
			<label class="option" v-else>
				<checkbox :value="item.id" :checked="item.selected"/>
			</label>
		</view>
	</view>
	</checkbox-group>
</template>

<script>
	import thumImg from "./thum-img.vue"
	
	export default {
		name: "deviceItem",
		data(){
			return {
				showMore: true
			}
		},
		props: {
			item: {
				type: Object,
				default(){
					return {
						chain: "",
						eq_name: "",
						eq_id: ""
					}
				}
			},
			type: String,
			children: {
				type: Array,
				default(){
					return [];
				}
			},
			selection: {
				type: Boolean,
				default: false
			}
		},
		components: {thumImg},
		computed: {
			page(){
				return this.$page;
			}
		},
		methods: {
			del(eq_id){
				this.$emit("del", eq_id);
			},
			trigger(){
				this.showMore = !this.showMore;
				this.$emit("trigger", this.showMore);
			},
			checkChange(e){
				this.$emit("change", this.item.id, !!e.detail.value.length);
			}
		}
	}
</script>

<style>
</style>
