import {post} from "@/common/api.request.js"
import {pageSize} from "@/common/config.js"

/**
 * @description 审核人员列表
 * @param   keyName  关键字：名称或电话
 * @param   pageSize
 * @param   pageNumber
 */
const getUserList = (data) => {
	data.pageSize = data.pageSize || pageSize;
	data.pageNumber = data.pageNumber || 1;
	return post({
		url: "person/queryUserByPosition",
		data
	});
}

/**
 * @description 审核人员列表
 * @param   audit  审核结果，1.通过 2.不通过
 * @param   USER_ID   	审核对象id
 * @param   codeString  用逗号连接的角色code
 */
const audit = data => {
	return post({
		url: "person/audit",
		data
	});
}

export default {
	getUserList,
	audit
}