/*
	Written by Stanko
	RocketHelpers - it will become micro library at some point
	http://www.rocketlaunch.me
*/

if (!window.getComputedStyle) {
	window.getComputedStyle = function(el, pseudo) {
		this.el = el;
		this.getPropertyValue = function(prop) {
			var re = /(\-([a-z]){1})/g;
			if (prop == 'float') prop = 'styleFloat';
			if (re.test(prop)) {
				prop = prop.replace(re, function () {
					return arguments[2].toUpperCase();
				});
			}
			return el.currentStyle[prop] ? el.currentStyle[prop] : null;
		};
		return this;
	};
}

var RL = RL || {};

RL.$ = function (s) {
	var r = document.querySelectorAll(s),
		length = r.length;
	return r.length === 1 ? r[0] : r;
};

RL.detectIE = function(){
	return document.all ? true : false;
};