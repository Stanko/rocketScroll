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

	// Check if argument element or selector
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
		this.el.id = 'rocketScroll'+(RS.__id++);
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
	// Getting element's padding
	// TODO find more elegant solution
	var elStyle = window.getComputedStyle(this.el, ''),
		paddingValue = elStyle.getPropertyValue('padding-top') + ' ' +
		elStyle.getPropertyValue('padding-right') + ' ' +
		elStyle.getPropertyValue('padding-bottom') + ' ' +
		elStyle.getPropertyValue('padding-left');

	// Div which is scrolled, 50px wider to hide scrollbar
	this.scrollDiv = document.createElement('div');
	this.scrollDiv.style.width = this.el.clientWidth + 50 + 'px';
	this.scrollDiv.className += ' scrollDiv';

	// Content div
	// Copies original html of the element and it's padding
	this.contentDiv = document.createElement('div');
	this.contentDiv.className += ' scrollContent';
	this.contentDiv.style.padding = paddingValue;
	this.contentDiv.style.width = this.el.clientWidth + 'px';

	// Tells script to move content div, rather than copy it, to preserve bindings in it
	// If you use this that div needs to wrap content inside the element
	// and to have class "rocketCopyThisContent"
	var firstChild = RS.$('#' + this.el.id + ' .rocketCopyThisContent');
	if(firstChild.length !== 0){
		this.contentDiv.appendChild(firstChild);
	}
	else{
		this.contentDiv.innerHTML = this.el.innerHTML;
	}

	// Removes the content
	this.el.innerHTML = '';
	this.el.style.padding = 0;

	// Adds new content
	this.scrollDiv.appendChild(this.contentDiv);
	this.el.appendChild(this.scrollDiv);

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
	var $this = this;

	// Move handle on mouse scroll
	this.scrollDiv.onscroll = function(){
		$this.handle.style.marginTop = $this.ratio * this.scrollTop + 'px';
	};


	// Just stop propagating click to scrollbar
	this.handle.onclick = function(e){
		RS.stopPropagation(e);
	};

	// Detect when mouse is pressed
	this.handle.onmousedown = function(e){
		e = e || window.event; // IE Fix

		RS.stopPropagation(e);

		$this.contentDiv.className += $this.UNSELECTABLE_CLASS;
		RS.enableSelection(false);

		$this.clientY = e.clientY;
		$this.scrollTop = $this.scrollDiv.scrollTop;
		$this.mouseDown = true;

	};
	this.el.onmouseup = function(){
		$this.setMouseUpAndEnableSelection($this);
	};

	// IE supports onmouseleave evenet
	if(RS.detectIE()){
		this.el.onmouseleave = function(){
			$this.setMouseUpAndEnableSelection($this);
		};
	}
	// Emulation for the other browsers, because they trigger mouseout on child nodes
	else{
		this.el.onmouseout = function(e){
			// Check if relatedTarget (element mouse moved on to) is child of the our element
			var current = e.relatedTarget;
			while(current){
				if(current == this){
					// If it is then mouse didn't left the element
					return;
				}
				current = current.parentNode;
			}
			$this.setMouseUpAndEnableSelection($this);
		};
	}


	// Handles mouse move, only when mouse is pressed
	this.el.onmousemove = function(e){
		// User is not holding mouse button
		if(!$this.mouseDown){
			return;
		}

		e = e || window.event; // IE Fix
		$this.scrollDiv.scrollTop = ((e.clientY - $this.clientY) / $this.ratio) + $this.scrollTop;
	};

	// Handles click on the scrollbar
	this.scrollbar.onclick = function(e){
		e = e || window.event; // IE Fix

		RS.stopPropagation(e);

		// Moves center of the handle to the cursor
		var layerY = RS.getOffset(e) - $this.handle.clientHeight / 2;

		$this.scrollDiv.scrollTop = layerY / $this.totalHandle * $this.totalScrollable;
	};

	// Dirty fix for chrome/webkit browsers where you can scroll left by selecting text
	this.el.onscroll = function(e){
		e.preventDefault();
		$this.el.scrollLeft = 0;
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
	updateImagesOnload = updateImagesOnload || false;

	// Refresh multiple elements
	if(this.multiple){
		for( var i in this.elements){
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

	if(updateImagesOnload){
		this.refreshImages();
	}
};

RS.RocketScroll.prototype.refreshImages = function() {
	// Refresh after every image load
	var images = RS.$('#' + this.el.id + ' .scrollContent img');

	if(images.length > 0){
		var $this = this;

		for(var i=0; i<images.length; i++){
			images.item(i).onload = function(){
				$this.refresh();
				// removing onload event
				this.onload = null;
			};
		}
	}
};

RS.RocketScroll.prototype.updateContent = function(newContent){
	// Updates all scrolls with same content :/
	// To update single one use varName.elements[i].contentDiv.innerHTML = INSERT_CONTENT_HERE;
	if(this.multiple){
		for( var i in this.elements){
			this.elements[i].contentDiv.innerHTML = newContent;
			this.elements[i].refresh();
		}
		return;
	}

	// Updates and refresh
	this.contentDiv.innerHTML = newContent;
	this.refresh();
	this.refreshImages();
};