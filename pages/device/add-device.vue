<template>
	<view class="add-device device form">
		<view v-if="queryLoading !== 0"><v-loading :state="queryLoading"></v-loading></view>
		<view class="no-text grey" v-else-if="!list.length">暂无相关设备。</view>
		<view class="pro-ul" v-for="(pro, pIdx) in list" v-if="pro.children.length" :key="pIdx">
			<text class="pro-name">项目：{{pro.name}}</text>
			<block v-for="(item, cIdx) in pro.children" :key="cIdx">
				<device-item :item="item" :type="item.type" selection @change="selChange"></device-item>
			</block>
		</view>
		<!-- #ifndef APP-PLUS -->
			<view class="form-btn" v-if="list.length"><button type="primary" @click="save">保存</button></view>
		<!-- #endif -->
	</view>
</template>

<script>
	import deviceItem from "./components/device-item.vue"
	import vLoading from "@/components/v-loading/v-loading.vue"
	import api from "@/api/device.js"
	import ut from "@/common/utils.js"
	export default {
		name: "addDevice",
		data() {
			return {
				queryLoading: 0,  //0 初始状态，1 加载中，2 加载完毕，3 加载错误
				saveLoading: false,
				list: [],
				selList: []  //已勾选的设备列表，每一项为id（eq_id）
			};
		},
		components: {deviceItem, vLoading},
		onLoad(){
			this.query();
		},
		onPullDownRefresh(){
			this.query(true);
		},
		onNavigationBarButtonTap(){
			this.save();
		},
		methods: {
			query(refresh){
				this.queryLoading = 1;
				this.list = [];
				this.selList = [];
				this.$nextTick(() => {
					api.queryAll().then(res => {
						this.list = res.data;
						this.queryLoading = 0;
						{  //初始化已关注的设备列表
							let list = [];
							res.data.forEach(item => {
								if(item.children.length){
									item.children.forEach(child => {
										if(child.selected === true){
											list.push(child.id);
										}
									});
								}
							});
							this.selList = [...list];
						}
						uni.stopPullDownRefresh();
						if(refresh){
							ut.showToast("刷新成功", "success");
						}
					}).catch(err => {
						console.log("err", err);
						this.queryLoading = 3;
						uni.stopPullDownRefresh();
					});
				});
			},
			save(){
				let str = this.selList.join(",");
				if(!str){
					ut.showToast("请选择至少一个设备");
					return;
				}
				ut.showLoading("正在提交");
				api.save(str).then(res => {
					console.log("save res:", res);
					ut.showToast(res.msg, "success");
					this.$store.dispatch("updateDeviceList");  // 添加成功，更新一下设备列表
					setTimeout(uni.navigateBack, 1000);
				}).catch();
			},
			selChange(id, val){
				let list = [...this.selList];
				let index = list.indexOf(id);
				if(val === true){
					if(!~index){
						list.push(id);
					}
				}else if(val === false){
					if(!!~index){
						list.splice(index, 1);
					}
				}
				this.selList = [...list];
			}
		}
	}
</script>

<style lang="scss">
	@import "./components/device.scss";
</style>
