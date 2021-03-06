import {post} from "@/common/api.request.js"
import {pageSize, baseRequestUrl} from "@/common/config.js"

/**
 * @description 添加设备保存
 * @param  eq_id  必传  String  32byte  所选择的以逗号连接的的设备ID字符串
 */
const save = eq_id => {
	return post({
		url: "device/save",
		data: {eq_id}
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
 * @description 添加设备时查询可供添加的设备列表
 */
const queryAll = () => {
	return post({
		url: "device/pcSimpleQuery"
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
	queryAll,
	detail,
	del,
	history,
	getPicUrl: baseRequestUrl + "file/getPic",
	getDeviceFileUrl: baseRequestUrl + "file/getDeviceFile?fileId="
}