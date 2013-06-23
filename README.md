rocketScroll
============

Pure JavaScript scroll bar script. Support native mouse wheel scroll. Easy customizable css. Works even in IE8+.

Made with love <3

I decided to biuld this, as didn't find single plain JavaScript script that actually works. Either that, or those would need whole jQuery with plugins for mouse scroll and stuf... This script is really small, and uses simple trick to preserve native mouse wheel / arrows scroll. It is done by css, and element that is actually scrolling is 50px wider than the parent. So native scroll bar is still there and works, but hidden from the eye of the user.


## Why you should use it

* Plain JavaScript, very small, no jQuery or external libraries
* Works in most of browsers. Tested in FF 21, Chrome 27, IE 8, IE 9, Safari 6
* Easy customizable via CSS
* Native arrows / mouse wheel support


## Still work in progress

Although even this version is working pretty smooth. Feel free to try it and give suggestions. Will be updated soon.


## DEMO

Too sleepy at the moment :) tomorrow! Just download zip and try it.


## TODO

* Replace helpers with custom micro JS library (nevermind this one :D)
* Don't copy innerHTML of the document, but wrap it in needed HTML (to save binding on inner elements)
* Make clicking on the scrollbar move handle to be centered to the place where user clicked (now it brings top of the handle there)
* Disable it when content fits the container
* Don't enable it at touch screens at all
* Fix bugs :P


## Known issues

Looks like there is crapload of issues - but don't worry! Most of them are minor, and will be solved in reasonable time.

* Doesn't work properly when used on the body tag. Not sure if I'm going to fix this - just use one wrapper div :)
* In webkit browsers (Chrome, Safari) you can scroll right by selecting text. I have a dirty fix, which just resets the scroll. Looking for more elegant solution.
* Need to replace event.layerY property with something else as it is depreciated in new broswers, and it doesn't work in IE8.
* Clicking on the scrollbar doesn't scroll in IE8 for that reason
* When scrolling by pulling handle, if mouse leaves the element, scroll is stopped. This is due the glitch in IE/webkit (It made element "locked" in scroll mode on the next mouse enter, untill you click somewhere.)

Please give suggestions, fork, upgrade, share, use and abuse it! Pull request are more than welcome :)

Hope you like it :)
Cheers!