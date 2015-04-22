$(document).ready(function(){
	jQuery.validator.messages.required = "*必填";
	jQuery.validator.messages.email = "<br>*请输入正确的email格式";
	jQuery.validator.addMethod("mobile", function( value, element ) {
		var result = this.optional(element) || value.length == 11 && /^(?:13\d|15\d|18\d|14\d)\d{8}$/.test(value);
		if (!result) {
			//element.value = "";
			var validator = this;
			setTimeout(function() {
				validator.blockFocusCleanup = true;
				element.focus();
				validator.blockFocusCleanup = false;
			}, 1);
		}
		return result;
	}, "<br>请输入正确的手机号，以13,15,18开始");
	jQuery.validator.addMethod("chineseword",function(value,element){
		var result = this.optional(element) ||  /^[\u4e00-\u9fa5]+$/.test(value);
		if (!result) {
			//element.value = "";
			var validator = this;
			setTimeout(function() {
				validator.blockFocusCleanup = true;
				element.focus();
				validator.blockFocusCleanup = false;
			}, 1);
		}	
		return result;
	},"<br>请输入中文");
	
	jQuery.validator.addMethod("postalCode", function( value, element ) {
		var result = this.optional(element) || value.length == 6 && /^\d{6}/.test(value);
		if (!result) {
			//element.value = "";
			var validator = this;
			setTimeout(function() {
				validator.blockFocusCleanup = true;
				element.focus();
				validator.blockFocusCleanup = false;
			}, 1);
		}
		return result;
	}, "<br>请输入正确的邮编格式，6位数字");
	
	jQuery.validator.addMethod("numberLimit2",function(value,element){
	var result = this.optional(element) ||  /^\d+(\d|(\.[0-9]{1,2}))$/.test(value);
	if (!result) {
		//element.value = "";
		var validator = this;
		setTimeout(function() {
			validator.blockFocusCleanup = true;
			element.focus();
			validator.blockFocusCleanup = false;
		}, 1);
	}
	return result;
	},"最多两位小数");
	
	});