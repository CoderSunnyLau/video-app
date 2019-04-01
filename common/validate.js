import ut from "@/common/utils.js"

/**
 *   表单验证
 *   data  Object  表单数据
 *   rules  Object  每个属性名为对应的data表单数据的属性名，每个属性为 Object 或 Array 类型  例：rules: {required: true, message: "必填项"}
 * 			rule   非传入参数，为rules里面的每一条验证规则，是个对象，可能包含的属性如下
 * 				message  验证不通过时弹出的提示
 * 				required  是否必填
 * 				max  最大长度
 * 				min  最小长度
 * 				type  输入框内容的类型，可根据类型自动校验，有以下几种取值 （待完善）
 * 						email     邮箱地址
 * 						phone 	  手机号码
 * 						tel       电话号码
 * 						postcode  邮政编码
 * 						url       网址
 * 						phone&tel 手机号码或电话号码
 * 				length  指定长度
 */

const validate = (data, rules) => {
	if(typeof data !== "object" || typeof rules !== "object" || Array.isArray(data) || Array.isArray(rules)){  //若参数传入有误则返回
		console.error("validate: 参数传入有误，data 和 rules 只接受Object类型的参数");
		return;
	}
	for(let key in rules){
		// console.log("key", key, rules[key], data)
		let item = rules[key];
		if(typeof item === "object"){
			let dataItem = data[key];
// 			if(dataItem === undefined){
// 				continue;
// 			}
			if(Array.isArray(item)){  //当item为数组时
				for(let j in item){
					let rule = item[j];
					let valid = ruleValidate(dataItem, rule);
					if(valid === true){
						continue;
					}else if(valid === false || typeof valid === "string"){
						ut.showToast(rule.message || valid || "表单校验未通过");
						return false;
						break;
					}else{
						return;
						break;
					}
				}
			}else{  //当item为对象时
				let rule = item;
				let valid = ruleValidate(dataItem, rule);
				console.log("false string", valid)
				if(valid === true){
					continue;
				}else if(valid === false || typeof valid === "string"){
					console.log("false string", valid)
					ut.showToast(rule.message || valid || "表单校验未通过");
					return false;
					break;
				}else{
					return;
					break;
				}
			}
		}else{
			console.warn("validate: item应为Object或Array类型");
			continue;
		}
	}
	return true;
}

// 单个验证规则
const ruleValidate = (item, rule) => {
	if(typeof rule !== "object" || Array.isArray(rule)){
		console.error("ruleValidate: 只接收Object类型的参数");
		return;
	}else{
		// 必填项判断
		if(rule.required === true){
			if(item === undefined || item === "" || item === null){
				return false;
			}else{
				return true;
			}
		}
		// 长度
		if(rule.max || rule.min){
			// 最大长度
			let max = parseInt(rule.max);
			if(rule.max){
				if(isNaN(max)){
					console.error("ruleValidate: max必须是数字");
				}else{
					if(item.length > max){
						return false;
					}
				}
			}
			// 最小长度
			let min = parseInt(rule.min);
			if(rule.min){
				if(isNaN(min)){
					console.error("ruleValidate: min必须是数字");
				}else{
					if(item.length < min){
						return false;
					}
				}
			}
			return true;
		}
		// 长度
		if(rule.length){
			return (item.length === rule.length);
		}
		// 类型
		if(rule.type){
			item = item + "";
			switch(rule.type){
				case "phone": 
					if(!item){
						return true;
					}else if(item.length !== 11){
						return "手机号码长度为11位数字";
					}else{
						return ut.checkPhone(item) || "手机号码格式有误";
					}
					break;
				case "tel": return (!item || ut.checkTel(item) || "电话号码格式有误"); break;  //如果值为空不进行验证，返回true；否则进行验证
				case "email": return (!item || ut.checkEmail(item) || "邮箱格式有误"); break;
				case "postcode": 
					if(!item){
						return true;
					}else if(item.length !== 6){
						return "邮政编码长度为6位数字";
					}else{
						return ut.checkPostcode(item) || "邮政编码有误"; 
					}
					break;
				case "url": return (!item || ut.checkUrl(item) || "网址格式有误"); break;
				case "phone&tel": return (!item || ut.checkPhone(item) || ut.checkTel(item) || "电话号码格式有误"); break;
			}
		}
		// 自定义验证方法
		if(typeof rule.validator === "function"){
			return rule.validator(item, rule) || true;
		}
		return true;
	}
}

export default validate