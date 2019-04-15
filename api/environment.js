import {post} from "@/common/api.request.js"

/**
 * @description 环境监测数据
 */
const query = () => {
	return post({
		url: "envdata/queryData"
	});
}


export default {
	query
}