/** "11".toInt(0) */
String.prototype.toInt = function(defaultValue) {
	if(!this)return defaultValue;
	try{
		return parseInt(this,10);
	}catch(e){
		return defaultValue;
	}
};
String.prototype.trim = function() { return this.replace(/(^\s*)|(\s*$)/g, "");};
/** 是否数字 */
String.prototype.isNumber = function() {
	var s = this.trim();
	return (s.replace(/\d/g, "").length == 0);
};
/** aaaa... */
String.prototype.toOmit=function(len){
	var tmpstr = this;
	if(len>1&&this.length>len){
		tmpstr=this.substring(0,(len))+"...";
	}
	return tmpstr;
};
String.prototype.startWith=function(str){
	if(str==null||str==""||this.length==0||str.length>this.length){
		return false;
	}else if(this.substr(0,str.length)==str){
		return true;
	}else{
		return false;
	}
};
/** 自动换行 */
String.prototype.autoLine = function(len) {
	var text=this;
	if(navigator.userAgent.indexOf("MSIE")==-1) {
		var strTemp="";
		while(text.length>len){
			strTemp+=text.substr(0,len)+" - <br/>";  
			text=text.substr(len,text.length);  
		}
		strTemp+=text;
		text=strTemp;
	}
	return text;
};
$util={
		"text":{
			"isValid":function(val){
				return val &&val!= null &&val!='undefined' &&val!= "";
			}
		}
};
/** jquery.center */
(function($){
	$.fn.center=function(settings){
		var style=$.extend({
			position:'absolute',//absolute or fixed
			top:'50%',			//50%即居中，将应用负边距计算，溢出不予考虑了。
			left:'50%',
			zIndex:2009,
			relative:true		//相对于包含它的容器居中还是整个页面
		}, settings || {});
		return this.each(function(){
			var $this=$(this);
			if(style.top == '50%') style.marginTop=-$this.outerHeight()/2;
			if(style.left == '50%') style.marginLeft=-$this.outerWidth()/2;
			if(style.relative && !$this.parent().is('body') && $this.parent().css('position') == 'static')
			$this.parent().css('position','relative');
			delete style.relative;
			//ie6
			if(style.position == 'fixed' && $.browser.version=='6.0'){
				style.marginTop += $(window).scrollTop();
				style.position = 'absolute';
				$(window).scroll(function(){
					$this.stop().animate({marginTop:$(window).scrollTop()-$this.outerHeight()/2});
				});
			}
			$this.css(style);
		});
	};
})(jQuery);
