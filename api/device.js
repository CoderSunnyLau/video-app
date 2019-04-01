import {post} from "@/common/api.request.js"
import {pageSize} from "@/common/config.js"

/**
 * @description 添加设备保存
 * @param  eq_id  必传  String  32byte  所选择的的设备ID
 * @param  chain_password  必传  String  100byte  密码
 * @param  chain_name  非必传  String  100yte  用户ID
 */
const save = (data) => {
	return post({
		url: "device/save",
		data
	});
}

/**
 * @description 根据云ID获取设备信息
 * @param  chain  必传  String  云ID
 */
const getByChain = (chain) => {
	return post({
		url: "device/queryDeviceSimple",
		data: {chain}
	});
}

/**
 * @description 获取设备列表
 * @param  pageSize 
 * @param  pageNumber 
 */
const formerQuery = (data) => {
	return post({
		url: "device/query",
		data
	});
}

/**
 * @description 获取设备列表 树结构
 */
const query = () => {
	return post({
		url: "device/pcQuery"
	});
}

/**
 * @description 获取设备详情
 * @param  eq_id   设备id
 */
const detail = (eq_id) => {
	return post({
		url: "device/queryDetail",
		data: {eq_id}
	});
}

/**
 * @description 取消关注设备
 * @param  eqIdString   设备id
 */
const del = (eqIdString) => {
	return post({
		url: "device/delete",
		data: {eqIdString}
	});
}

/**
 * @description 获取设备历史告警历史
 * @param  eq_id  设备id
 * @param  pageSize
 * @param  pageNumber
 * @param  startTime 
 * @param  endTime 
 */
const history = data => {
	data.pageSize = data.pageSize || pageSize;
	data.pageNumber = data.pageNumber || 1;
	return post({
		url: "alarm/query",
		data
	});
}


export default {
	save,
	getByChain,
	formerQuery,
	query,
	detail,
	del,
	history
}