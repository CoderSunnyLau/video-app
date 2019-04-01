import {baseRequestUrl, page} from "./config.js"
import ut from "./utils.js"

const request = function (requestObj, test, hideToast) {  //test是不拦截9004的情况, hideToast 是否隐藏弹出提示
	return new Promise((resolve, reject) => {
// 		
// 			let currPage = getCurrentPages();
// 			console.log(currPage)
// 			currPage = currPage[currPage.length - 1];
// 			console.log(currPage.route, currPage.options)
		// console.log('请求的数据：'+JSON.stringify(requestObj.data));
		uni.request({
			url: baseRequestUrl + requestObj.url,
			method: requestObj.method,
			header: {
				"content-type": "application/json",
				"sessionId": uni.getStorageSync("sessionId")
				// "sessionId": "925b1da4-2e08-44b9-b51a"
			},
			data: requestObj.data,
			success: function (res) {
				if(res.statusCode === 200) {
					let data = res.data;
					if (data.code && data.code !== 1) {
						if(test && data.code === 9000){
							resolve(data);
							return;
						}
						if (data.code === 9000) {
							let currPage = getCurrentPages();
							currPage = currPage[currPage.length - 1];
							let option = JSON.stringify(currPage.options);
							console.log(currPage.route, option);
							if(!hideToast) ut.showToast("您的登录信息已失效，即将为您重新登录");
							setTimeout(()=> {
								uni.reLaunch({
									url: page.login + "?target=" + currPage.route + "&option=" + option
								});
							}, 1000);
						} else if (data.msg){
							if(!hideToast) ut.showToast(data.msg);
						} else {
							if(!hideToast) ut.showToast("网络错误，请重试");
						}
						reject(data);
					} else {
						resolve(data);
					}
					// console.log("successs");
				} else {
					console.log("error");
					if(!hideToast) ut.showToast("网络错误，请稍后重试");
					reject({msg: "网络错误，请稍后重试"});
				}
			},
			fail: function (err) {
				// console.log(JSON.stringify(err));
				if(/timeout/g.test(err.errMsg)){
					if(!hideToast) ut.showToast("网络繁忙请稍后重试");
				}else{
					if(!hideToast) ut.showToast("网络错误");
				}
				console.log("error", err);
				reject(err);
			}
		});
	});
}

const post = function (postObj) {
	postObj.method = "POST";
	
	return request(postObj);
}

const get = function (postObj) {
	postObj.method = "GET";
	return request(postObj);
}

const test = (postObj) => {  //不拦截 9000 的情况
	postObj.method = "POST";
	return request(postObj, true);
}

const noToastPost = (postObj) => {  //不弹错误提示
	postObj.method = "POST";
	return request(postObj, false, true);
}

module.exports = {
	request,
	post,
	get,
	test,
	noToastPost
}