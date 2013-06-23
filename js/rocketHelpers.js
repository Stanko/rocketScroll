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


// BIG TODO
//
// MAKE THIS NICE, THIS IS A MESS :)
//
function relMouseCoords(e){
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var canvasX = 0;
	var canvasY = 0;
	var currentElement = e.currentTarget;

	while(currentElement){
		totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
		totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
		currentElement = currentElement.offsetParent;
	}

    var posx = 0;
    var posy = 0;
    e = e || window.event;

    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY)     {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

	var coords = {
		'x' : posx - totalOffsetX,
		'y' : posy - totalOffsetY
	};

	return coords;
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