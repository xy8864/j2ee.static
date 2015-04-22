mapbar.util = mapbar.util ||{};
(
	function(package) {
		//cookie begin
		/**
		 * @description cookie操作
		 */
		var _cookie = {
			/** 
			 * @description 设置cookie
			 * @function
			 * @param {String} name 要设置的cookie的名字
			 * @param {String|Number} value 要设置的cookie的值
			 * @param {Object} option cookie的参数 
			 *                 .expireDays {Number} 过期时间(天数) 
			 *                 .path {String} cookie路径 
			 *                 .domain {String} cookie域 
			 *                 .secure {Boolean} 是否安全
			 * @return {void}
			 */
			setCookie : function(name, value, option) {
				//用于存储赋值给document.cookie的cookie格式字符串
				var str = name + "=" + escape(value);
				if (option) {
					//如果设置了过期时间
					if (option.expireDays) {
						var date = new Date();
						var ms = option.expireDays*24*3600*1000;
						date.setTime(date.getTime() + ms);
						str += "; expires=" + date.toGMTString();
					};
					if (option.path) {
						str += "; path=" + option.path;
					}
					if (option.domain) {
						str += "; domain=" + option.domain;
					}
					if (option.secure) {
						str += "; true";
					}
				}
				document.cookie = str;
			},
			/** 
			 * @description 设置mapbar cookie，修改域为mapbar.com，如果缺少option参数，默认保存30天，path为"/"
			 * @function
			 * @param {String} name 要设置的cookie的名字
			 * @param {String|Number} value 要设置的cookie的值
			 * @param {Object} option cookie的参数 
			 *                 .expireDays {Number} 过期时间(天数) 
			 *                 .path {String} cookie路径 
			 *                 .domain {String} cookie域 
			 *                 .secure {Boolean} 是否安全
			 * @return {void}
			 */
			setMCookie : function(name, value, option) {
				var domain = location.href.indexOf("mapbar.com") == -1 ? "" : "mapbar.com";
				if (!option) {
					option = {expireDays : '30', domain : domain, path : '/'};
				} else {
					option.domain = domain;
				}
				this.setCookie(name, value, option);
			},
			/** 
			 * @description 取得cookie的值
			 * @function
			 * @param {String} name 要取得的cookie的名字
			 * @return {String} cookie的值,没有找到返回("")
			 */
			getCookie : function(name) {
				var cookieRet = "";
				var cookieArray = document.cookie.split("; ");
				//var cookie = new Object();
				for (var i = 0; i < cookieArray.length; i++) {
					var arr = cookieArray[i].split("=");
					if (arr[0] == name) {
						cookieRet = unescape(arr[1]);
					}
				};
				return cookieRet;
			},
			/** 
			 * @description 删除cookie
			 * @function
			 * @param {String} name 要删除的cookie的名字
			 * @return {void}
			 */
			deleteCookie : function(name){
				this.setCookie(name, "", {expireDays : -1});
			}
		};
		//将_cookie注册到package.cookie
		package.cookie = _cookie;
		//cookie end
		
		//request param begin
		/** 
		 * @description 从url中取得请求参数
		 */
		var _request = {
			/** 
			 * @description 从url中取得hash部分的请求参数(#后)
			 * @function
			 * @param {String} [newUrl="window.location.hash"] 要取得参数的url
			 * @return {Map} 参数值对(key:value)
			 */
			getHashObj : function(newUrl) {
				newUrl = newUrl || window.location.hash;
				var request = {};
				var strs = newUrl;
				if (newUrl.lastIndexOf("#") >= 0) {
					strs = newUrl.substr(newUrl.lastIndexOf("#") + 1);
					strs = strs.split("&");
					
					for (var id = 0; id < strs.length; id++) {
						/* 避免关键字中带 & 符号*/
						if (strs[id].indexOf("=") > 0) {
							request[strs[id].split("=")[0]] = strs[id].split("=")[1];
						}
					}
				}
				return request;
			},
			/** 
			 * @description 从url中取得请求参数(?后,#前)
			 * @function
			 * @param {String} [newUrl="window.location.href"] 要取得参数的url
			 * @return {Map} 参数值对(key:value)
			 */
			getParamObj : function(newUrl) {
				newUrl = newUrl || window.location.href;
				var request = {};
				var strs = newUrl;
				if (newUrl.indexOf("?") >= 0) {
					strs = newUrl.substr(newUrl.indexOf("?") + 1);
					if (strs.indexOf("#") >= 0) {
						strs = strs.substr(0, strs.indexOf("#"));
					}
					
					strs = strs.split("&");
					for (var id = 0; id < strs.length; id++) {
						/* 避免关键字中带 & 符号*/
						if (strs[id].indexOf("=") > 0) {
							request[strs[id].split("=")[0]] = strs[id].split("=")[1];
						}
					}
				}
				return request;
			},
			/** 
			 * @description 从url中取得请求参数(?部分参数将覆盖#部分参数),替换原有的init方法
			 * @function
			 * @param {String} [newUrl="window.location.href"] 要取得参数的url
			 * @return {Map} 参数值对(key:value)
			 */
			getObj : function(newUrl) {
				var paramObj = this.getParamObj(newUrl);
				var hashObj = this.getHashObj(newUrl);
				for (var key in paramObj) {
					hashObj[key] = paramObj[key];
				}
				return hashObj;
			},
			/** 
			 * @description 将一个Map对象转换为url的String
			 * @function
			 * @param {Map} requestObj 要转换为字符串的Map
			 * @return {String} 转换为url的String
			 */
			toHashString : function(requestObj){
				var newHash = "";
				for (var i in requestObj) {
					if (i != "" 
						&& requestObj[i] != undefined 
							&& requestObj[i] != "" 
								&& requestObj[i] != "undefined") {
						newHash += (newHash == "" ? "" : "&") + i + "=" + requestObj[i];
					}
				}
				return newHash;
			}
		};
		//将_request注册到package.request
		package.request = _request;
		//request param end
		
		
		// jsLoader begin
		/** 
		 * @description 继承
		 * @function
		 * @param {Object} destination 
		 * @param {Object} source 
		 * @return {Object}
		 */
		var _extend = function(destination, source) {
			for (var property in source) {destination[property] = source[property];}
			return destination;
		};
		/** 
		 * @description 创建一个Class
		 * @function
		 * @return {Function}
		 */
		var _createClass = function() {return function() {this.initialize.apply(this, arguments);}};
		
		/**
		 * jsLoader base
		 *
		 */
		var Transfer = {};
		Transfer.Base = function() {};
		Transfer.Base.prototype = {
			setOptions : function(options) {
				if(typeof options != "object"){
					options = {};
				}
				this.options = {
					bCache : options.bCache || false,
					id : options.id || "scriptTemp",
					onfailure : options.onfailure || function(){},
					oncomplate : options.oncomplate || function(){}
				};
			}
		};
		
		/** 
		 * @description 拉取远程js类
		 * @constructor 构造器
		 * @param {String} url js文件的url
		 * @param {Map} [options={}] 请求参数
		 *              .[id="scriptTemp"] {String} 创建script标签的id属性
		 *              .[bCache=false] {Boolean} 是否启用缓存
		 *              .onfailure {Function} 失败时执行的函数
		 *              .oncomplate {Function} 成功时执行的函数
		 */
		Transfer.Request = _createClass();
		Transfer.Request.prototype = _extend(new Transfer.Base(), {
			initialize : function(url, options) {
				this.setOptions(options);
				this.request(url);
			},
			request : function(url) {
				this.url = url;
				this.bCache = this.options.bCache;
				this.id = this.options.id;
				this.oncomplate = this.options.oncomplate;
				this.onfailure = this.options.onfailure;
				this.symbol = "?";
				if (this.url.indexOf("?") != -1) {
					this.symbol = "&";
				}
				var head = document.getElementsByTagName("head")[0];
				var sT = document.getElementById(this.id);
				if (sT && sT.src && sT.src == this.url) {
					this.oncomplate();
					return;
				}
				if (sT) {
					sT.parentNode.removeChild(sT);
				}
				var s = document.createElement("script");
				head.appendChild(s);
				s.setAttribute("language", "javascript");
				s.setAttribute("type", "text/javascript");
				s.setAttribute("id", this.id);
				s.setAttribute("src", (this.bCache && this.bCache == true) ? this.url + this.symbol + Math.random() : this.url);
				var self = this;
				s.onload = s.onreadystatechange = function() {
					if (typeof ActiveXObject!="undefined") {
						if(s.readyState && s.readyState == "loaded") {
							self.oncomplate();
						}
						if(s.readyState && s.readyState == "complete") {
							return;
						}
					} else {
						self.oncomplate();
					}
				};
				s.onerror = function() { 
					//ie not work
					if(s && s.parentNode) {
						s.parentNode.removeChild(s);
					}
					self.onfailure();
					//throw new Error("connect faild,please try later;");
				};
			 }
		});
		
		//将Transfer.Request注册到package.transfer.Request
		package.transfer = {
			Request : Transfer.Request
		};
		/****jsLoader end****/
		
		
		//get Utf-8 begin
		function _v10toX(n, m) {
			var ss = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_@";
			//n = 16;
			m = String(m).replace(/ /gi, "");
			if (m == "") {
				return "";
			}
			if (parseInt(m) != m) {
				//alert("请输入整数！");
				return "";
			}
			var t = "";
			var a = ss.substr(0, n);
			while (m != 0) {
				var b = m % n;
				t = a.charAt(b) + t;
				m = (m - b) / n;
			}
			return t;
		};
		/** 
		 * @description 取得转换后的utf8字符串
		 * @function
		 * @param {String} str 要转换的字符串
		 * @return {String} 转换后的字符串
		 */
		function getUtf8(str) {
			var ret = "";
			for (var i=0; i<str.length; i++) {
				var charcode = String(str.charAt(i)).charCodeAt();
				if (charcode > 256) {
					var ccode = encodeURI(str.charAt(i));//.replace(/%/gi,"")
					ret += ccode;
				} else {
					ret += _v10toX(16, charcode);
				}
			}
			return ret;
		};
		//将getUtf8注册到package.getUtf8
		package.getUtf8 = getUtf8;
		//get Utf-8 end
		
		//toHtmlStr begin
		/** 
		 * @description 将字符串转换成html格式
		 * @function
		 * @param {String} str 要转换的字符串
		 * @return {String} 转换后的字符串
		 */
		function toHtmlStr(str) {
			if(typeof str != "string") {
				return str;
			}
			str = str.replace(/</ig, "&lt;");
			str = str.replace(/>/ig, "&gt;");
			str = str.replace(/\r\n|\n\r|\n|\r/g, "<br>");
			str = str.replace(/\"/ig, "&quot;");
			str = str.replace(/\ /ig, "&nbsp;");
			return str;
		};
		//将toHtmlStr注册到package.toHtmlStr
		package.toHtmlStr = toHtmlStr;
		//toHtmlStr end
		
	}
)(mapbar.util);