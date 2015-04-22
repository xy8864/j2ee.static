// 将非标准浏览器的本地存储桥接成标准API (IE6 IE7) 
(function () {

	function UserData() {
		this.userData = null;
		this.name = location.hostname;

		if (!this.userData) {
			try {
				this.userData = document.documentElement;
				this.userData.addBehavior("#default#userData");

				var expires = new Date();
				expires.setDate(expires.getDate() + 365);
				this.userData.expires = expires.toUTCString();
			}
			catch (e) {}
		}
	}

	UserData.prototype = {

		setItem: function (key, data) {
			try {
				this.userData.setAttribute(key, data);
				this.userData.save(this.name);
			}
			catch (e) {}
		},

		getItem: function (key) {
			try {
				this.userData.load(this.name);
			}
			catch (e) {}

			return this.userData.getAttribute(key);
		},

		removeItem: function (key) {
			try {
				this.userData.load(this.name);
				this.userData.removeAttribute(key);
				this.userData.save(this.name);
			}
			catch (e) {}
		},

		clear: function () {
			try {
				this.userData.load(this.name);
				var attributes = this.userData.attributes;
				for (var i = 0; i < attributes.length; i++) {
					var key = attributes[i].name;
					if (key != 'type' && key != 'style') this.userData.removeAttribute(key);
				}
				this.userData.save(this.name);
			}
			catch (e) {}
		}

	};

	// 如果不支持本地存储
	// 使用USERDATA替代接口
	if (!window.localStorage) window.localStorage = new UserData();
})();