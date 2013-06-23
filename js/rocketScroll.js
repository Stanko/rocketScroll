/*
	Written by Stanko
	RocketScroll
	http://www.rocketlaunch.me
*/

var RL = RL || {};

RL.RocketScroll = function (selector){
	this.el = RL.$(selector);
	this.el.className += ' rocketScroll';

	this.mouseDown = false;

	this.UNSELECTABLE_CLASS = ' unselectable';

	this.buildHTML();
	this.addScrollbar();
	this.refresh();
	this.bindEvents();
};


RL.RocketScroll.prototype.buildHTML = function() {
	// Getting element's padding
	// TODO find more elegant solution
	var elStyle = window.getComputedStyle(this.el, ''),
		paddingValue = elStyle.getPropertyValue('padding-top') + ' ' +
		elStyle.getPropertyValue('padding-right') + ' ' +
		elStyle.getPropertyValue('padding-bottom') + ' ' +
		elStyle.getPropertyValue('padding-left');

	// Div which is used for hiding scrollbar
	// TODO maybe get client height?
	this.fixDiv = document.createElement('div');
	this.fixDiv.style.width = this.el.clientWidth + 50 + 'px';
	this.fixDiv.className += ' scrollFix';

	// Content div
	// Copies original html of the element and it's padding
	this.contentDiv = document.createElement('div');
	this.contentDiv.className += ' scrollContent';
	this.contentDiv.style.padding = paddingValue;
	this.contentDiv.innerHTML = this.el.innerHTML;

	// Removes the content
	this.el.innerHTML = '';
	this.el.style.padding = 0;

	// Adds new content
	this.fixDiv.appendChild(this.contentDiv);
	this.el.appendChild(this.fixDiv);
};


RL.RocketScroll.prototype.addScrollbar = function() {
	// Adds scrollbar and handle HTML

	this.handle = document.createElement('div');

	this.scrollbar = document.createElement('div');
	this.scrollbar.className += ' scrollbar';
	this.scrollbar.appendChild(this.handle);

	this.el.appendChild(this.scrollbar);
};

RL.RocketScroll.prototype.bindEvents = function(){
	var $this = this;

	// Move handle on mouse scroll
	this.fixDiv.onscroll = function(){
		$this.handle.style.marginTop = $this.ratio * this.scrollTop + 'px';
	};

	// Detect when mouse is pressed
	this.handle.onmousedown = function(e){
		e = e || window.event; // IE Fix

		if(e.stopPropagation){
			e.stopPropagation();
		}
		else{
			// IE8 and lower stop propagation
			window.event.cancelBubble = true;
			window.event.returnValue = false;
		}

		$this.contentDiv.className += $this.UNSELECTABLE_CLASS;

		$this.clientY = e.clientY;
		$this.scrollTop = $this.fixDiv.scrollTop;
		$this.mouseDown = true;
	};
	this.el.onmouseup = function(){
		$this.contentDiv.className = $this.contentDiv.className.replace($this.UNSELECTABLE_CLASS, '');
		$this.mouseDown = false;
	};

	// Fix scroll lock
	this.el.onmouseout = function(e){
		e = e || window.event; // IE Fix

		// Emulates onmouse leave (onmouse out is triggered when mouse gets over child element)
		if ((e.relatedTarget || e.toElement) == this.parentNode){
			$this.mouseDown = false;
			$this.contentDiv.className = $this.contentDiv.className.replace($this.UNSELECTABLE_CLASS, '');
		}
	};

	// Dirty fix for chrome/webkit browsers where you can scroll left by selecting text
	this.el.onscroll = function(e){
		e.preventDefault();
		$this.el.scrollLeft = 0;
	};

	// Handles mouse move, only when mouse is pressed
	this.el.onmousemove = function(e){
		// User is not holding mouse button
		if(!$this.mouseDown){
			return;
		}

		e = e || window.event; // IE Fix
		$this.fixDiv.scrollTop = ((e.clientY - $this.clientY) / $this.ratio) + $this.scrollTop;
	};

	// Handles click on the scrollbar
	this.scrollbar.onclick = function(e){
		e = e || window.event; // IE Fix

		var offset = relMouseCoords(e);

		// Moves center of the handle to the cursor
		offset.y -= $this.handle.clientHeight/2;

		$this.fixDiv.scrollTop = offset.y / $this.totalHandle * $this.totalScrollable;
	};
};

RL.RocketScroll.prototype.refresh = function(){
	// Refreshing scroll bar position and ratio
	// Should be called on content change
	this.totalScrollable = this.contentDiv.clientHeight - this.fixDiv.clientHeight;
	this.totalHandle = this.scrollbar.clientHeight - this.handle.clientHeight;

	this.ratio = this.totalHandle / this.totalScrollable;

	this.handle.style.marginTop = this.ratio * this.fixDiv.scrollTop + 'px';
};

