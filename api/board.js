import {post} from "@/common/api.request.js"

/**
 * @description 看板查询接口
 */
const query = () => {
	return post({
		url: "board/query"
	});
}

/**
 * @description 获取看板详情
 * @param  rec_id   记录id
 */
const detail = (rec_id) => {
	return post({
		url: "board/queryDetail",
		data: {rec_id}
	});
}

export default {
	query,
	detail
}