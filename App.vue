<script>
	import common from "@/api/common.js";
	import {mapMutations} from "vuex";
	
	export default {
		methods: {
			...mapMutations(["setPx"])
		},
		onLaunch: function() {
			console.log("App Launch");
			
			uni.getProvider({
				service: "push",
				success: function (res) {
					console.log(res.provider)
					// 个推的名称为 igexin
					if (~res.provider.indexOf("igexin")) {
						uni.subscribePush({
							provider: "igexin",
							success: function (res1) {
								console.log("subscribePush success:" + JSON.stringify(res1));
							}
						});
					}
				}
			});
			
			let platform="";
			let px = 0.5;
			try { 
				let systemInfo = uni.getSystemInfoSync();
				px = systemInfo.windowWidth / 750;
				if(systemInfo != null){
					platform = systemInfo.platform;
				}
				console.log(JSON.stringify(systemInfo));
			} catch (e) {
				// error
				console.log(e);
			}
			this.setPx(px);  //设置upx和px的比。
			//#ifdef APP-PLUS  
				// App检查更新
				var info = plus.push.getClientInfo(); 
				console.log( "获取客户端推送标识信息：(个推需要保存的)" );  
				console.log(JSON.stringify(info));
				 
				var APPLICATION_ID = "1001";
				plus.screen.lockOrientation("portrait-primary"); //锁定
				plus.runtime.getProperty(plus.runtime.appid, (res) => {
					
					// 检测升级
					common.checkVersion({
						appid: plus.runtime.appid,
						imei: plus.device.imei,
						VERSION: res.version,
						APPLICATION_ID: APPLICATION_ID,
						PLAT_FORM: platform
					}).then(res => {
						console.log("check Version res：" + JSON.stringify(res));
						if(res.IS_NEED_UPDATE==1){
							console.log("需要更新");
							let openUrl = res.updateInfo.URL;
							let IS_ENFORCE=res.updateInfo.IS_ENFORCE;
							// 提醒用户更新
							uni.showModal({
								title: "更新提示",
								content: res.updateInfo.NOTE ? res.updateInfo.NOTE : "是否选择更新",
								success: (showResult) => {
									if (showResult.confirm) {
										plus.runtime.openURL(openUrl);
									}
								}
							});
						}else{
							console.log("不需要更新");
						}
					}).catch(err => {
						console.log("checkVersion err" + JSON.stringify(err));
					});
				});
				
				  /* 5+  push 消息推送 ps:使用:H5+的方式监听，实现推送*/  
				plus.push.addEventListener("click", function(msg) {  
						// plus.ui.alert("click:"+JSON.stringify(msg));  
						console.log("click:"+JSON.stringify(msg));
						console.log("payload:"+JSON.stringify(msg.payload));
						//此处可以从payload中获取后台参数
						// plus.ui.alert(JSON.stringify(msg.payload));  
						// plus.ui.alert(JSON.stringify(msg));  
						setTimeout(function(){
							uni.navigateTo({
								url: this.$page.login
							});
						},1000);

					}, false);
						// 监听在线消息事件	
					plus.push.addEventListener("receive", function(msg) {  
						console.log("recevice:"+JSON.stringify(msg));
						// plus.ui.alert("recevice:"+JSON.stringify(msg))  
				}, false);
				
				// plus.push.createMessage("您有一条新消息");
		   //#endif  
				
			uni.onPush({
				provider: "igexin",
				success: function () {
					console.log("监听透传成功");
				},
				callback: function (data) {
					console.log("接收到透传数据：" + JSON.stringify(data));
					uni.showToast({
						icon: "none",
						title: ""+"接收到透传数据：" 
					});
				}
			});
		},
		onShow: function() {
			console.log("App Show");
		},
		onHide: function() {
			console.log("App Hide");
		}
	}
	
</script>

<style lang="scss">
	@import "./style/index.scss";
</style>
