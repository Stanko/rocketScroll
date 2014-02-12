rocketScroll
============

Pure JavaScript scroll bar script. Support native mouse wheel scroll. Easy customizable css. Works even in IE8+.

Made with love <3

I decided to biuld this, as didn't find single plain JavaScript script that actually works. Either that, or those would need whole jQuery with plugins for mouse scroll and stuff... This script is really small, and uses simple trick to preserve native mouse wheel / arrows scroll. It is done by css, and element that is actually scrolling is 50px wider than the parent. So native scroll bar is still there and works, but hidden from the eye of the user.

## DEMO

[Click here for demo](http://stanko.github.io/rocketScroll/). Yay, let us see it live :)

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


## TODO

* ~~Make demo~~
* ~~Don't copy html of the document, but wrap it in needed HTML (to save bindings on inner elements)~~ [1]
* ~~Make clicking on the scrollbar move handle to be centered to the place where user clicked (now it brings top of the handle there)~~
* ~~Disable it when content fits the container~~
* ~~Don't enable it at touch screens at all~~
* ~~Make it possible to apply it directly to multiple elements (ie. giving class name)~~
* ~~Dynamic height of the handle (depending of the element and scrollabe content ratio)~~
* ~~Call refresh "onload" on images~~
* Fix bugs :P


[1] To use this you need to wrap inside content in div, which has class - rocketCopyThisContent. Even with this not all events can be perserved.

## Known issues

Looks like there is crapload of issues - but don't worry! Most of them are minor, and will be solved in reasonable time.

* Doesn't work properly when used on the body tag. Not sure if I'm going to fix this - just use one wrapper div :)
* In webkit browsers (Chrome, Safari) you can scroll right by selecting text. I have a dirty fix, which just resets the scroll. Looking for more elegant solution.
* ~~Need to replace event.layerY property with something else as it is deprecated in new broswers, and it doesn't work in IE8.~~
* ~~Clicking on the scrollbar doesn't scroll in IE8 for that reason~~
* When scrolling by pulling handle, if mouse leaves the element, scroll is stopped. This is due the glitch in IE/webkit (It made element "locked" in scroll mode on the next mouse enter, untill you click somewhere.)

Please give suggestions, fork, upgrade, share, use and abuse it! Pull request are more than welcome :)

Hope you like it :)
Cheers!
