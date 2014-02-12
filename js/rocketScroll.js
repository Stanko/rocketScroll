/*
	Written by Stanko
	RocketScroll
	https://github.com/Stanko/rocketScroll
	http://www.rocketlaunch.me
*/

var RS = RS || {};

RS.__id = 0;

RS.RocketScroll = function (element, isElement){
	// Don't enable it on touch screens
	if(RS.detectTouchScreen()){
		return;
	}

	isElement = isElement || false;

	// Check if argument is element or selector
	if(isElement){
		this.el = element;
	}
	else{
		this.el = RS.$(element);
	}

	// If selector return node list apply scroll to each node
	if(typeof(this.el.length) !== 'undefined' && this.el.length > 1){
		this.elements = [];
		for(var i = 0; i < this.el.length; i++){
			this.elements.push( new RS.RocketScroll(this.el.item(i) , true) );
		}
		this.multiple = true;
		return;
	}
	else{
		this.multiple = false;
	}

	// Adds ID to the element if there is none
	if(!this.el.id){
		this.el.id = 'rocketScroll' + (RS.__id++);
	}

	this.el.className += ' rocketScroll';

	this.mouseDown = false;

	this.UNSELECTABLE_CLASS = ' unselectable';

	this.buildHTML();
	this.addScrollbar();
	this.refresh();
	this.bindEvents();

	this.SELECTION_TIMEOUT = false;
};


RS.RocketScroll.prototype.buildHTML = function() {
	// Div which is scrolled, 50px wider to hide scrollbar
	this.scrollDiv = RS.$('#' + this.el.id + ' .scrollDiv');
	this.scrollDiv.style.width = this.el.clientWidth + 50 + 'px';

	// Content div
	// Copies original html of the element and it's padding
	this.contentDiv = RS.$('#' + this.el.id + ' .scrollContent');
	this.contentDiv.style.width = this.el.clientWidth + 'px';

	this.refreshImages();
};

RS.RocketScroll.prototype.addScrollbar = function() {
	// Adds scrollbar and handle HTML

	this.handle = document.createElement('div');

	this.scrollbar = document.createElement('div');
	this.scrollbar.className += ' scrollbar';
	this.scrollbar.appendChild(this.handle);

	this.el.appendChild(this.scrollbar);
};

RS.RocketScroll.prototype.bindEvents = function(){
	var self = this;

	// Move handle on mouse scroll
	this.scrollDiv.onscroll = function(){
		self.handle.style.marginTop = self.ratio * this.scrollTop + 'px';
	};


	// Just stop propagating click to scrollbar
	this.handle.onclick = function(e){
		RS.stopPropagation(e);
	};

	// Detect when mouse is pressed
	this.handle.onmousedown = function(e){
		e = e || window.event; // IE Fix

		RS.stopPropagation(e);

		self.contentDiv.className += self.UNSELECTABLE_CLASS;
		RS.enableSelection(false);

		self.clientY = e.clientY;
		self.scrollTop = self.scrollDiv.scrollTop;
		self.mouseDown = true;

	};
	this.el.onmouseup = function(){
		self.setMouseUpAndEnableSelection(self);
	};

	// IE supports onmouseleave evenet
	if(RS.detectIE()){
		this.el.onmouseleave = function(){
			self.setMouseUpAndEnableSelection(self);
		};
	}
	// Emulation for the other browsers, because they trigger mouseout on child nodes
	else{
		this.el.onmouseout = function(e){
			// Check if relatedTarget (element mouse moved on to) is child of the our element
			var current = e.relatedTarget;
			while(current){
				if(current === this){
					// If it is then mouse didn't left the element
					return;
				}
				current = current.parentNode;
			}
			self.setMouseUpAndEnableSelection(self);
		};
	}


	// Handles mouse move, only when mouse is pressed
	this.el.onmousemove = function(e){
		// User is not holding mouse button
		if(!self.mouseDown){
			return;
		}

		e = e || window.event; // IE Fix
		self.scrollDiv.scrollTop = ((e.clientY - self.clientY) / self.ratio) + self.scrollTop;
	};

	// Handles click on the scrollbar
	this.scrollbar.onclick = function(e){
		e = e || window.event; // IE Fix

		RS.stopPropagation(e);

		// Moves center of the handle to the cursor
		var layerY = RS.getOffset(e) - self.handle.clientHeight / 2;

		self.scrollDiv.scrollTop = layerY / self.totalHandle * self.totalScrollable;
	};

	// Dirty fix for chrome/webkit browsers where you can scroll left by selecting text
	this.el.onscroll = function(e){
		e.preventDefault();
		self.el.scrollLeft = 0;
	};
};

RS.RocketScroll.prototype.setMouseUpAndEnableSelection = function(instance){
	instance.contentDiv.className = instance.contentDiv.className.replace(instance.UNSELECTABLE_CLASS, '');
	instance.mouseDown = false;

	// Small delay on enabling text selecting again
	clearTimeout(instance.SELECTION_TIMEOUT);
	instance.SELECTION_TIMEOUT = setTimeout(function(){
		RS.enableSelection(true);
	}, 500);
};

RS.RocketScroll.prototype.refresh = function(updateImagesOnload){
	var i;

	updateImagesOnload = updateImagesOnload || false;

	// Refresh multiple elements
	if(this.multiple){
		for(i in this.elements){
			this.elements[i].refresh();
		}
		return;
	}


	// If content is smaller than the container
	if(this.scrollDiv.clientHeight > this.contentDiv.clientHeight){
		this.scrollbar.style.display = 'none';
	}
	else{
		this.scrollbar.style.display = 'block';
	}

	// Dynamic scroll handle height, as the content is smaller
	// handle gets bigger, as there is less to scroll
	this.handle.style.height = this.scrollDiv.clientHeight * (this.scrollDiv.clientHeight / this.contentDiv.clientHeight) + 'px';

	// Refreshing scroll bar position and ratio
	// Should be called on content change
	this.totalScrollable = this.contentDiv.clientHeight - this.scrollDiv.clientHeight;
	this.totalHandle = this.scrollbar.clientHeight - this.handle.clientHeight;

	this.ratio = this.totalHandle / this.totalScrollable;

	this.handle.style.marginTop = this.ratio * this.scrollDiv.scrollTop + 'px';

	this.refreshImages();
};

RS.RocketScroll.prototype.refreshImages = function() {
	var images, self, i;

	// Refresh after every image load
	images = RS.$('#' + this.el.id + ' .scrollContent img');

	if(images.length > 0){
		self = this;

		for(i = 0; i < images.length; i++){
			images.item(i).onload = function(){
				self.refresh();
				// removing onload event
				this.onload = null;
			};
		}
	}
};

