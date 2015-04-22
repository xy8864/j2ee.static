mapbar.util = mapbar.util ||{};
(
	function(package) {
		//cookie begin
		/**
		 * @description cookie����
		 */
		var _cookie = {
			/** 
			 * @description ����cookie
			 * @function
			 * @param {String} name Ҫ���õ�cookie������
			 * @param {String|Number} value Ҫ���õ�cookie��ֵ
			 * @param {Object} option cookie�Ĳ��� 
			 *                 .expireDays {Number} ����ʱ��(����) 
			 *                 .path {String} cookie·�� 
			 *                 .domain {String} cookie�� 
			 *                 .secure {Boolean} �Ƿ�ȫ
			 * @return {void}
			 */
			setCookie : function(name, value, option) {
				//���ڴ洢��ֵ��document.cookie��cookie��ʽ�ַ���
				var str = name + "=" + escape(value);
				if (option) {
					//��������˹���ʱ��
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
			 * @description ����mapbar cookie���޸���Ϊmapbar.com�����ȱ��option������Ĭ�ϱ���30�죬pathΪ"/"
			 * @function
			 * @param {String} name Ҫ���õ�cookie������
			 * @param {String|Number} value Ҫ���õ�cookie��ֵ
			 * @param {Object} option cookie�Ĳ��� 
			 *                 .expireDays {Number} ����ʱ��(����) 
			 *                 .path {String} cookie·�� 
			 *                 .domain {String} cookie�� 
			 *                 .secure {Boolean} �Ƿ�ȫ
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
			 * @description ȡ��cookie��ֵ
			 * @function
			 * @param {String} name Ҫȡ�õ�cookie������
			 * @return {String} cookie��ֵ,û���ҵ�����("")
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
			 * @description ɾ��cookie
			 * @function
			 * @param {String} name Ҫɾ����cookie������
			 * @return {void}
			 */
			deleteCookie : function(name){
				this.setCookie(name, "", {expireDays : -1});
			}
		};
		//��_cookieע�ᵽpackage.cookie
		package.cookie = _cookie;
		//cookie end
		
		//request param begin
		/** 
		 * @description ��url��ȡ���������
		 */
		var _request = {
			/** 
			 * @description ��url��ȡ��hash���ֵ��������(#��)
			 * @function
			 * @param {String} [newUrl="window.location.hash"] Ҫȡ�ò�����url
			 * @return {Map} ����ֵ��(key:value)
			 */
			getHashObj : function(newUrl) {
				newUrl = newUrl || window.location.hash;
				var request = {};
				var strs = newUrl;
				if (newUrl.lastIndexOf("#") >= 0) {
					strs = newUrl.substr(newUrl.lastIndexOf("#") + 1);
					strs = strs.split("&");
					
					for (var id = 0; id < strs.length; id++) {
						/* ����ؼ����д� & ����*/
						if (strs[id].indexOf("=") > 0) {
							request[strs[id].split("=")[0]] = strs[id].split("=")[1];
						}
					}
				}
				return request;
			},
			/** 
			 * @description ��url��ȡ���������(?��,#ǰ)
			 * @function
			 * @param {String} [newUrl="window.location.href"] Ҫȡ�ò�����url
			 * @return {Map} ����ֵ��(key:value)
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
						/* ����ؼ����д� & ����*/
						if (strs[id].indexOf("=") > 0) {
							request[strs[id].split("=")[0]] = strs[id].split("=")[1];
						}
					}
				}
				return request;
			},
			/** 
			 * @description ��url��ȡ���������(?���ֲ���������#���ֲ���),�滻ԭ�е�init����
			 * @function
			 * @param {String} [newUrl="window.location.href"] Ҫȡ�ò�����url
			 * @return {Map} ����ֵ��(key:value)
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
			 * @description ��һ��Map����ת��Ϊurl��String
			 * @function
			 * @param {Map} requestObj Ҫת��Ϊ�ַ�����Map
			 * @return {String} ת��Ϊurl��String
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
		//��_requestע�ᵽpackage.request
		package.request = _request;
		//request param end
		
		
		// jsLoader begin
		/** 
		 * @description �̳�
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
		 * @description ����һ��Class
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
		 * @description ��ȡԶ��js��
		 * @constructor ������
		 * @param {String} url js�ļ���url
		 * @param {Map} [options={}] �������
		 *              .[id="scriptTemp"] {String} ����script��ǩ��id����
		 *              .[bCache=false] {Boolean} �Ƿ����û���
		 *              .onfailure {Function} ʧ��ʱִ�еĺ���
		 *              .oncomplate {Function} �ɹ�ʱִ�еĺ���
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
		
		//��Transfer.Requestע�ᵽpackage.transfer.Request
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
				//alert("������������");
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
		 * @description ȡ��ת�����utf8�ַ���
		 * @function
		 * @param {String} str Ҫת�����ַ���
		 * @return {String} ת������ַ���
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
		//��getUtf8ע�ᵽpackage.getUtf8
		package.getUtf8 = getUtf8;
		//get Utf-8 end
		
		//toHtmlStr begin
		/** 
		 * @description ���ַ���ת����html��ʽ
		 * @function
		 * @param {String} str Ҫת�����ַ���
		 * @return {String} ת������ַ���
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
		//��toHtmlStrע�ᵽpackage.toHtmlStr
		package.toHtmlStr = toHtmlStr;
		//toHtmlStr end
		
	}
)(mapbar.util);