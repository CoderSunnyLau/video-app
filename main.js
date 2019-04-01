import Vue from "vue"
import App from "./App"

import store from "./store"
import {page} from "./common/config.js"

Vue.config.productionTip = false;

Vue.prototype.$store = store;
Vue.prototype.$page = page;

import vIcon from "./components/v-icon/v-icon.vue"
import vButton from "./components/form/v-button.vue"
import vInput from "./components/form/v-input.vue"
import fItem from "./components/form/form-item.vue"
import vImg from "./components/v-img/v-img.vue"
Vue.component("vIcon", vIcon);
Vue.component("vButton", vButton);
Vue.component("vInput", vInput);
Vue.component("fItem", fItem);
Vue.component("vImg", vImg);

App.mpType = "app"

const app = new Vue({
	store,
	...App
})
app.$mount()
