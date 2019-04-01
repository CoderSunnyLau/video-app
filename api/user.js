import {post} from "@/common/api.request.js"

/**
 * @description 找回密码（手机号重置）
 * @param mobile  手机号
 * @param  password  密码
 * @param  verifyCode  验证码
 */
const forgetPassword = (data) => {
	return post({
		url: "mobleAppAuth/resetPassword",
		data
	});
}

/**
 * @description 修改密码
 * @param username  用户名
 * @param  password  新密码
 * @param  oldPassword  旧密码
 */
const updatePassword = (data) => {
	return post({
		url: "person/updatePassword",
		data
	});
}

/**
 * @description 获取用户信息
 */
const info = () => {
	return post({
		url: "person/query"
	});
}

/**
 * @description 修改用户信息
 * @param USER_ID  用户id
 * @param  TELNO  电话
 * @param  SEX  性别
 * @param  EMAIL  邮箱
 * @param  ADDRESS  地址
 * @param  POSTCODE  邮编
 * @param  PROVINCE  省
 * @param  CITY  市
 * @param  DISTRICT  区
 */
const update = (data) => {
	return post({
		url: "person/update",
		data
	});
}

/**
 * @description 取消或接收告警信息
 * @param  isNotify  是否接收告警信息 0.否 1.是
 */
const updateNotify = (isNotify) => {
	return post({
		url: "person/updateNotify",
		data: {isNotify}
	});
}

export default {
	forgetPassword,
	updatePassword,
	info,
	update,
	updateNotify
}