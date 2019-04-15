import Vue from "vue"
import Vuex from "vuex"
import device from "@/api/device.js"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userName: "",
		deviceList: [],
		px: 0.5,
		NAME: "",
		downloadUrl: "https://",
		version: "1.0.0"
	},
	mutations: {
		updateDeviceList(state, list){
			state.deviceList = list;
		},
		setPx(state, px){
			state.px = px;
		},
		setName(state, NAME){
			state.NAME = NAME;
		},
		setDownloadUrl(state, url){
			state.downloadUrl = url;
		},
		setVersion(state, version){
			state.version = version;
		}
	},
	actions: {
		updateDeviceList(context){
			return new Promise((resolve, reject) => {
				device.query().then(res => {
					context.commit("updateDeviceList", res.data);
					resolve(res);
				}).catch(err => {
					context.commit("updateDeviceList", []);
					reject(err);
				});
			});
		}
	}
});

export default store
