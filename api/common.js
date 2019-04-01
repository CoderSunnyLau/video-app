import {post} from "@/common/api.request.js"

/**
 * @description 登录
 */
const login = data => {
	return post({
		url: "mobleAppAuth/login",
		data
	});
}

/**
 * @description 退出登录
 */
const logout = () => {
	return post({
		url: "auth/logout"
	});
}

/**
 * @description 注册
 * @param  userName   64
 * @param  password   32
 * @param  verifyCode  验证码
 */
const register = data => {
	return post({
		url: "mobleAppAuth/register",
		data
	});
}

/**
 * @description 发送手机验证码
 * @param  MOBILE   手机号
 */
const sendVerify = MOBILE => {
	return post({
		url: "mobleAppAuth/sendMobileVerifyCode",
		data: {MOBILE}
	});
}

/**
 * 检查更新升级
 */
const checkVersion = data => {
	return post({
		url: "update/checkVersion",
		data
	});
}

/**
 * 检查更新升级
 */
const getSessionId = data => {
	return post({
		url: "mobleAppAuth/getSessionId",
		data
	});
}

export default {
	login,
	logout,
	register,
	sendVerify,
	checkVersion,
	getSessionId
}