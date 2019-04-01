import {post} from "@/common/api.request.js"

/**
 * @description 获取省编码列表
 */
const province = () => {
	return post({
		url: "code/queryCodeList",
		data: {GROUP_CODE: "code_province"}
	});
}

/**
 * @description 获取市编码列表
 * @param  CODE   省编码
 */
const city = CODE => {
	return post({
		url: "code/queryCodeList",
		data: {GROUP_CODE: "code_city", CODE}
	});
}

/**
 * @description 获取区编码列表
 * @param  CODE   市编码
 */
const district = CODE => {
	return post({
		url: "code/queryCodeList",
		data: {GROUP_CODE: "code_district", CODE}
	});
}

/**
 * @description 获取区编码列表
 * @param  CODE   市编码
 */
const role = () => {
	return post({
		url: "roleManage/queryCodes"
	});
}

export default {
	province,
	city,
	district,
	role
}