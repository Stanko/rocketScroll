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
			if (prop === 'float'){
				prop = 'styleFloat';
			}
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

RL.getScrollTop = function(){
	if(typeof pageYOffset !== 'undefined'){
		//most browsers
		return pageYOffset;
	}
	else{
		var b = document.body, //IE 'quirks'
			d = document.documentElement; //IE with doctype
		d = (d.clientHeight) ? d : b;
		return d.scrollTop;
	}
};

// Gets Y offset of event, relative to source element
// Calculating X is commented, as this plugin is not using it
RL.getOffset = function(e) {
	var el = e.target ? e.target : e.srcElement, // IE Check
		//x = 0,
		y = 0;

	while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
		//x += el.offsetLeft - el.scrollLeft;
		y += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	}

	//x = e.clientX + RL.getScrollLeft() - x;
	y = e.clientY + RL.getScrollTop() - y;

	//return { x: x, y: y };
	return y;
};

RL.stopPropagation = function(e){
	if(e.stopPropagation){
		e.stopPropagation();
	}
	else{
		// IE8 and lower stop propagation
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
};

RL.$ = function (s) {
	var r = document.querySelectorAll(s);
	return r.length === 1 ? r[0] : r;
};

RL.detectIE = function(){
	return document.all ? true : false;
};