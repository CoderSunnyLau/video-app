import cf from "../static/pages.json"

let pageTemp = {};

cf.pages.forEach(item => {
	if(item.name) pageTemp[item.name] = "/" + item.path;
});

console.log("page", pageTemp);

const url = {
	//开发库配置
	baseRequestUrl: "http://192.168.10.115:8381/app/",  //后台服务
	websocketUrl: "ws://192.168.10.115:7499"
};
const basePicUrl = url.baseRequestUrl + "file/getPic";  //获取图片
// const basePageUrl = "/";
const page = pageTemp;
const pageSize = 20;

module.exports = {
	...url, page, pageSize, basePicUrl
}