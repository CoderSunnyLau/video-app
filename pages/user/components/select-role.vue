<template>
	<view class="select-role">
		<view class="bg" v-if="showModal" @click="cancel"></view>
		<view class="box" v-if="showModal">
			<view class="header">选择角色</view>
			<scroll-view class="content" scroll-y>
				<v-loading v-if="loadingState !== 0" :state="loadingState"></v-loading>
				<checkbox-group @change="checkboxChange">
					<label class="sel-row" v-for="item in list" :key="item.DICT_CODE">
						<checkbox :value="item.DICT_CODE"/><text>{{item.DICT_NAME}}</text>
					</label>
				</checkbox-group>
			</scroll-view>
			<view class="footer">
				<button @click="cancel">取消</button>
				<button type="primary" @click="confirm">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import api from "@/api/code.js"
	import ut from "@/common/utils.js"
	import vLoading from "@/components/v-loading/v-loading.vue"
	export default {
		name: "selectRole",
		data(){
			return {
				showModal: false,
				loadingState: true,
				list: [],
				selList: [],
				USER_ID: ""
			}
		},
		components: {vLoading},
		mounted(){
			this.getCode();
		},
		methods: {
			getCode(){
				this.loadingState = 1;
				api.role().then(res => {
					console.log(res);
					this.list = res.data;
					this.loadingState = 0;
				}).catch(err => {
					this.loadingState = 3;
				});
			},
			show(USER_ID){
				this.USER_ID = USER_ID;
				this.selList = [];
				this.showModal = true;
					console.log("userId", this.USER_ID)
			},
			checkboxChange(e){
				this.selList = e.detail.value;
			},
			confirm(){
				if(!this.selList.length){
					ut.showToast("请选择至少一个角色");
				}else{
					console.log("userId", this.USER_ID)
					this.showModal = false;
					this.$emit("selected", this.USER_ID, this.selList);
				}
			},
			cancel(){
				this.showModal = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.select-role{
		.bg{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0,0,0,0.5);
			z-index: 10;
		}
		.box{
			position: fixed;
			width: 650upx;
			height: 750upx;
			top: 50%;
			left: 50%;
			margin: -375upx 0 0 -325upx;
			background: #FFF;
			z-index: 11;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.header{
				line-height: 80upx;
				text-align: center;
				font-size: 30upx;
				border-bottom: 1px solid #DDD;
			}
			.content{
				height: 560upx;
				padding: 0 32upx;
				.sel-row{
					display: block;
					line-height: 60upx;
					checkbox{
						transform: scale(0.7);
					}
				}
			}
			.footer{
				display: flex;
				justify-content: space-between;
				button{
					flex: 1;
				}
			}
		}
	}
</style>
