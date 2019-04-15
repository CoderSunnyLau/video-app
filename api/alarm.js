import {post} from "@/common/api.request.js"
import {pageSize, baseRequestUrl} from "@/common/config.js"

/**
 * @description 告警历史
 * @param   eq_id  设备id
 * @param   startTime  告警时间开始
 * @param   endTime  告警时间结束
 * @param   pageSize
 * @param   pageNumber
 */
const history = (data) => {
	data.pageSize = data.pageSize || pageSize;
	data.pageNumber = data.pageNumber || 1;
	return post({
		url: "alarm/query",
		data
	});
}

/**
 * @description 告警中心设备告警列表
 * @param   eq_id  设备id
 * @param   startTime  告警时间开始
 * @param   endTime  告警时间结束
 */
const queryCenter = (data) => {
	return post({
		url: "alarm/queryCenter",
		data
	});
}

export default {
	history,
	queryCenter,
	getPicUrl: baseRequestUrl + "file/getPic"
}