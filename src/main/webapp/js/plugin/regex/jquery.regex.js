/*
 *
 * Copyright (c) 2009 C. F., Wong (<a href="http://cloudgen.w0ng.hk">Cloudgen Examplet Store</a>)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * See details in: <a href="http://cloudgen.w0ng.hk/javascript/javascript.php">Javascript Examplet</a>
 *
 */
// updated on 2009/09/21 by Cloudgen
// 1. accept selectors with regular expression construct and flags (igm), e.g: /\d+/g, /[aeiou]/ig, etc.
// 2. accept selectors with attribute name in the format: [attr,regex]
// 3. add regex() plugin
(function($){
	function regex(d,a,c){
		var k=new RegExp("\/(.(?!\/))*.\/[gim]*"),
		m=new RegExp(/\[([^\,]+)\,([^\]]+)\]/),
		f=c[3],e,b;
		if (m.test(f)){
			f=f.replace(m,function(s,s1,s2){b=d.getAttribute(s1);return s2})
		} else {
			b=("text"===d.type)?d.value:d.innerHTML;
		}
		e=(k.test(f))? eval("("+f+")") : new RegExp(f,"ig");
		return(b=="")?true:(e.exec(b))
	}
	$.extend($.expr[":"],{
		regex:function(d,a,c){
			return regex(d,a,c);
		}
	});
	$.fn.regex=function(s1,s2){
		var ret=[];
		this.each(function(i,v){
			var e,b;
			if(typeof s2==="undefined"){
				if(Object.prototype.toString.call(s1)==="[object RegExp]")
					e=new RegExp(s1);
				else
					e=new RegExp(s1,"ig");
				b=(typeof this.value!="undefined")?this.value:this.innerHTML;
			} else {
				if (typeof s1==="string"){
					if(Object.prototype.toString.call(s2)==="[object RegExp]")
						e=new RegExp(s2);
					else
					e=new RegExp(s2,"ig");
					b=this.getAttribute(s1);
				}
			}
			if (b!="" && e.test(b)) {
				ret.push(this);
			}
		});
		return this.pushStack(ret);
	};
})(jQuery);