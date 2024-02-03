rocketScroll
============

Pure JavaScript scroll bar script. Support native mouse wheel scroll. Easy customizable css. Works even in IE8+.

Made with love <3

I decided to biuld this, as didn't find single plain JavaScript script that actually works. Either that, or those would need whole jQuery with plugins for mouse scroll and stuff... This script is really small, and uses simple trick to preserve native mouse wheel / arrows scroll. It is done by css, and element that is actually scrolling is 50px wider than the parent. So native scroll bar is still there and works, but hidden from the eye of the user.

## DEMO

[Click here for demo](http://stanko.github.io/rocketScroll/).

## Why you should use it

* Plain JavaScript, very small  (2kb minifed/gzipped, 1kb of CSS) no jQuery or external libs
* Works in all modern browsers and even IE. Tested in FF 21, Chrome 27, IE 8, IE 9, Safari 6
* Easy customizable via CSS
* Native arrows / mouse wheel support


## Usage

HTML, why three divs? We need three divs to preserve native scroll. I used to create other two
in JavaScript, but that makes updating content and woking with events a lot harder.
I switched back to manual HTML coding, but still I think it is pretty simple.

	<div id="SOME_CSS_ID">
		<div class="scrollDiv">
			<div class="scrollContent">
				YOUR CONTENT HERE
			</div>
		</div>
	</div>

Then just pass CSS selector, (in IE8 only CSS 2.1 selectors).

``var rsSingle = new RS.RocketScroll('#scrollDiv');``

``var rsMultiple = new RS.RocketScroll('.scrollDiv');``


### .refresh(updateImagesOnload)

NOTICE!!! After manual updating the content, you need to call `.refresh()` method. It works for both single and multiple scrolls.


(Optional) If you send `updateImagesOnload = true`, method will call `.refreshImages()`. Default is `false`;


### .refreshImages()

On init and content updating, script calls this method, to update itself on every image load.


## Known issues

Looks like there is crapload of issues - but don't worry! Most of them are minor, and will be solved in reasonable time.

* Doesn't work properly when used on the body tag. Not sure if I'm going to fix this - just use one wrapper div :)
* ~~In webkit browsers (Chrome, Safari) you can scroll right by selecting text. I have a dirty fix, which just resets the scroll. Looking for more elegant solution. FIXED~~
* ~~Need to replace event.layerY property with something else as it is deprecated in new broswers, and it doesn't work in IE8. FIXED~~
* ~~Clicking on the scrollbar doesn't scroll in IE8 for that reason FIXED~~
* When scrolling by pulling handle, if mouse leaves the element, scroll is stopped. This is due the glitch in IE/webkit (It made element "locked" in scroll mode on the next mouse enter, untill you click somewhere.)
* Using nested scrolls make inner scrollbars show when hovering parent scroll element. This is handled by CSS, maybe switch to JS.

Please give suggestions, fork, upgrade, share, use and abuse it! Pull request are more than welcome :)

Hope you like it :)
Cheers!
