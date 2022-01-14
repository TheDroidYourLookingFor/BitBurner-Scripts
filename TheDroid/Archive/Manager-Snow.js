/** @param {NS} ns **/
export async function main(ns) {
	try {
		await let_it_snow(ns);
	} catch (e) {
		stop_snow();
		throw e;
	}
}

/** @param {NS} ns **/
async function let_it_snow(ns) {
	let win = globalThis['window'];
	let doc = win['document'];

	if(win.global_storm){ stop_snow(); }
	win.global_storm = {};
	createSnow();

	while (true) await ns.sleep(100);
}

function stop_snow(){
	let win = globalThis['window'];
	let doc = win['document'];
	if(!win.global_storm) return;
	let storm = win.global_storm;
	storm.stop();
	if(storm.events){
		storm.events.remove(win, 'resize', storm.resizeHandler);
		storm.events.remove(win, 'scroll', storm.scrollHandler);
		storm.events.remove(doc, 'focusout', storm.freeze);
		storm.events.remove(doc, 'focusin', storm.resume);
		storm.events.remove(win, 'blur', storm.freeze);
		storm.events.remove(win, 'focus', storm.resume);
		storm.events.remove(win, 'mousemove', storm.mouseMove);
	}
	if(storm.flakes){
		let wrapper = storm.flakes[0].o.parentNode;
		//wrapper.innerHTML = '';
		//wrapper.parentNode.removeChild(wrapper);
		storm.flakes.forEach(f => {
			f.o.parentNode.removeChild(f.o);
		})
	}
	storm.freeze = true;
	delete win.global_storm;
}

function createSnow() {

	/** @license
	* DHTML Snowstorm! JavaScript-based snow for web pages 
	* Making it snow on the internets since 2003. You're welcome.
	* -----------------------------------------------------------
	* Version 1.44.20131208 (Previous rev: 1.44.20131125)
	* Copyright (c) 2007, Scott Schiller. All rights reserved.
	* Code provided under the BSD License
	* http://schillmania.com/projects/snowstorm/license.txt
	*/
	let win = globalThis['window'];
	let _this = win.global_storm;
	let doc = win['document'];
	//var snowStorm = (function(win, doc) {

	_this.autoStart = true;          // Whether the snow should start automatically or not.
	_this.excludeMobile = true;      // Snow is likely to be bad news for mobile phones' CPUs (and batteries.) Enable at your own risk.
	_this.flakesMax = 128;           // Limit total amount of snow made (falling + sticking)
	_this.flakesMaxActive = 64;      // Limit amount of snow falling at once (less = lower CPU use)
	_this.animationInterval = 50;    // Theoretical "miliseconds per frame" measurement. 20 = fast + smooth, but high CPU use. 50 = more conservative, but slower
	_this.useGPU = true;             // Enable transform-based hardware acceleration, reduce CPU load.
	_this.className = null;          // CSS class name for further customization on snow elements
	_this.excludeMobile = true;      // Snow is likely to be bad news for mobile phones' CPUs (and batteries.) By default, be nice.
	_this.flakeBottom = null;        // Integer for Y axis snow limit, 0 or null for "full-screen" snow effect
	_this.followMouse = false;        // Snow movement can respond to the user's mouse
	_this.snowColor = '#fff';        // Don't eat (or use?) yellow snow.
	_this.snowCharacter = '&bull;';  // &bull; = bullet, &middot; is square on some systems etc.
	_this.snowStick = true;          // Whether or not snow should "stick" at the bottom. When off, will never collect.
	_this.targetElement = document.body;      // element which snow will be appended to (null = doc.body) - can be an element ID eg. 'myDiv', or a DOM node reference
	_this.useMeltEffect = true;      // When recycling fallen snow (or rarely, when falling), have it "melt" and fade out if browser supports it
	_this.useTwinkleEffect = false;  // Allow snow to randomly "flicker" in and out of view while falling
	_this.usePositionFixed = true;  // true = snow does not shift vertically when scrolling. May increase CPU load, disabled by default - if enabled, used only where supported
	_this.usePixelPosition = false;  // Whether to use pixel values for snow top/left vs. percentages. Auto-enabled if body is position:relative or targetElement is specified.

	// --- less-used bits ---
	_this.freezeOnBlur = false;       // Only snow when the win is in focus (foreground.) Saves CPU.
	_this.flakeLeftOffset = 0;       // Left margin/gutter space on edge of container (eg. browser win.) Bump up these values if seeing horizontal scrollbars.
	_this.flakeRightOffset = 0;      // Right margin/gutter space on edge of container
	_this.flakeWidth = 8;            // Max pixel width reserved for snow element
	_this.flakeHeight = 8;           // Max pixel height reserved for snow element
	_this.vMaxX = 5;                 // Maximum X velocity range for snow
	_this.vMaxY = 4;                 // Maximum Y velocity range for snow
	_this.zIndex = 999999;                // CSS stacking order applied to each snowflake

	// --- "No user-serviceable parts inside" past this point, yadda yadda ---
	var storm = _this,
		features,
		// UA sniffing and backCompat rendering mode checks for fixed position, etc.
		isIE = navigator.userAgent.match(/msie/i),
		isIE6 = navigator.userAgent.match(/msie 6/i),
		isMobile = navigator.userAgent.match(/mobile|opera m(ob|in)/i),
		isBackCompatIE = (isIE && doc.compatMode === 'BackCompat'),
		noFixed = (isBackCompatIE || isIE6),
		screenX = null, screenX2 = null, screenY = null, scrollY = null, docHeight = null, vRndX = null, vRndY = null,
		windOffset = 1,
		windMultiplier = 2,
		flakeTypes = 6,
		fixedForEverything = true,
		targetElementIsRelative = false,
		opacitySupported = (function () {
			return false;
		}()),
		didInit = false,
		docFrag = doc.createDocumentFragment();

	features = (function () {

		var getAnimationFrame;

		function timeoutShim(callback) {
			win.setTimeout(callback, 1000 / (storm.animationInterval || 20));
		}

		var _animationFrame = (win.requestAnimationFrame ||
			win.webkitRequestAnimationFrame ||
			win.mozRequestAnimationFrame ||
			win.oRequestAnimationFrame ||
			win.msRequestAnimationFrame ||
			timeoutShim);

		// apply to win, avoid "illegal invocation" errors in Chrome
		getAnimationFrame = _animationFrame ? function () {
			return _animationFrame.apply(win, arguments);
		} : null;

		var testDiv;

		testDiv = doc.createElement('div');

		function has(prop) {
			var result = testDiv.style[prop];
			return (result !== undefined ? prop : null);
		}

		// note local scope.
		var localFeatures = {

			transform: {
				ie: has('-ms-transform'),
				moz: has('MozTransform'),
				opera: has('OTransform'),
				webkit: has('webkitTransform'),
				w3: has('transform'),
				prop: null // the normalized property value
			},

			getAnimationFrame: getAnimationFrame

		};

		localFeatures.transform.prop = (
			localFeatures.transform.w3 ||
			localFeatures.transform.moz ||
			localFeatures.transform.webkit ||
			localFeatures.transform.ie ||
			localFeatures.transform.opera
		);

		testDiv = null;

		return localFeatures;

	}());

	_this.timer = null;
	_this.flakes = [];
	_this.disabled = false;
	_this.active = false;
	_this.meltFrameCount = 20;
	_this.meltFrames = [];

	_this.setXY = function (o, x, y) {

		if (!o) {
			return false;
		}

		if (storm.usePixelPosition || targetElementIsRelative) {

			o.style.left = (x - storm.flakeWidth) + 'px';
			o.style.top = (y - storm.flakeHeight) + 'px';

		} else if (noFixed) {

			o.style.right = (100 - (x / screenX * 100)) + '%';
			// avoid creating vertical scrollbars
			o.style.top = (Math.min(y, docHeight - storm.flakeHeight)) + 'px';

		} else {

			if (!storm.flakeBottom) {

				// if not using a fixed bottom coordinate...
				o.style.right = (100 - (x / screenX * 100)) + '%';
				o.style.bottom = (100 - (y / screenY * 100)) + '%';

			} else {

				// absolute top.
				o.style.right = (100 - (x / screenX * 100)) + '%';
				o.style.top = (Math.min(y, docHeight - storm.flakeHeight)) + 'px';

			}

		}

	};

	_this.events = (function () {

		var old = (!win.addEventListener && win.attachEvent), slice = Array.prototype.slice,
			evt = {
				add: (old ? 'attachEvent' : 'addEventListener'),
				remove: (old ? 'detachEvent' : 'removeEventListener')
			};

		function getArgs(oArgs) {
			var args = slice.call(oArgs), len = args.length;
			if (old) {
				args[1] = 'on' + args[1]; // prefix
				if (len > 3) {
					args.pop(); // no capture
				}
			} else if (len === 3) {
				args.push(false);
			}
			return args;
		}

		function apply(args, sType) {
			var element = args.shift(),
				method = [evt[sType]];
			if (old) {
				element[method](args[0], args[1]);
			} else {
				element[method].apply(element, args);
			}
		}

		function addEvent() {
			apply(getArgs(arguments), 'add');
		}

		function removeEvent() {
			apply(getArgs(arguments), 'remove');
		}

		return {
			add: addEvent,
			remove: removeEvent
		};

	}());

	function rnd(n, min) {
		if (isNaN(min)) {
			min = 0;
		}
		return (Math.random() * n) + min;
	}

	function plusMinus(n) {
		return (parseInt(rnd(2), 10) === 1 ? n * -1 : n);
	}

	_this.randomizeWind = function () {
		var i;
		vRndX = plusMinus(rnd(storm.vMaxX, 0.2));
		vRndY = rnd(storm.vMaxY, 0.2);
		if (_this.flakes) {
			for (i = 0; i < _this.flakes.length; i++) {
				if (_this.flakes[i].active) {
					_this.flakes[i].setVelocities();
				}
			}
		}
	};

	_this.scrollHandler = function () {
		var i;
		// "attach" snowflakes to bottom of win if no absolute bottom value was given
		scrollY = (storm.flakeBottom ? 0 : parseInt(win.scrollY || doc.documentElement.scrollTop || (noFixed ? doc.body.scrollTop : 0), 10));
		if (isNaN(scrollY)) {
			scrollY = 0; // Netscape 6 scroll fix
		}
		if (!fixedForEverything && !storm.flakeBottom && storm.flakes) {
			for (i = 0; i < storm.flakes.length; i++) {
				if (storm.flakes[i].active === 0) {
					storm.flakes[i].stick();
				}
			}
		}
	};

	_this.resizeHandler = function () {
		if (win.innerWidth || win.innerHeight) {
			screenX = win.innerWidth - 16 - storm.flakeRightOffset;
			screenY = (storm.flakeBottom || win.innerHeight);
		} else {
			screenX = (doc.documentElement.clientWidth || doc.body.clientWidth || doc.body.scrollWidth) - (!isIE ? 8 : 0) - storm.flakeRightOffset;
			screenY = storm.flakeBottom || doc.documentElement.clientHeight || doc.body.clientHeight || doc.body.scrollHeight;
		}
		docHeight = doc.body.offsetHeight;
		screenX2 = parseInt(screenX / 2, 10);
	};

	_this.resizeHandlerAlt = function () {
		screenX = storm.targetElement.offsetWidth - storm.flakeRightOffset;
		screenY = storm.flakeBottom || storm.targetElement.offsetHeight;
		screenX2 = parseInt(screenX / 2, 10);
		docHeight = doc.body.offsetHeight;
	};

	_this.freeze = function () {
		// pause animation
		if (!storm.disabled) {
			storm.disabled = 1;
		} else {
			return false;
		}
		storm.timer = null;
	};

	_this.resume = function () {
		if (storm.disabled) {
			storm.disabled = 0;
		} else {
			return false;
		}
		storm.timerInit();
	};

	_this.toggleSnow = function () {
		if (!storm.flakes.length) {
			// first run
			storm.start();
		} else {
			storm.active = !storm.active;
			if (storm.active) {
				storm.show();
				storm.resume();
			} else {
				storm.stop();
				storm.freeze();
			}
		}
	};

	_this.stop = function () {
		var i;
		_this.freeze();
		for (i = 0; i < _this.flakes.length; i++) {
			_this.flakes[i].o.style.display = 'none';
		}
		storm.events.remove(win, 'scroll', storm.scrollHandler);
		storm.events.remove(win, 'resize', storm.resizeHandler);
		if (storm.freezeOnBlur) {
			if (isIE) {
				storm.events.remove(doc, 'focusout', storm.freeze);
				storm.events.remove(doc, 'focusin', storm.resume);
			} else {
				storm.events.remove(win, 'blur', storm.freeze);
				storm.events.remove(win, 'focus', storm.resume);
			}
		}
	};

	_this.show = function () {
		var i;
		for (i = 0; i < _this.flakes.length; i++) {
			_this.flakes[i].o.style.display = 'block';
		}
	};

	_this.SnowFlake = function (type, x, y) {
		var s = this;
		this.type = type;
		this.x = x || parseInt(rnd(screenX - 20), 10);
		this.y = (!isNaN(y) ? y : -rnd(screenY) - 12);
		this.vX = null;
		this.vY = null;
		this.vAmpTypes = [1, 1.2, 1.4, 1.6, 1.8]; // "amplification" for vX/vY (based on flake size/type)
		this.vAmp = this.vAmpTypes[this.type] || 1;
		this.melting = false;
		this.meltFrameCount = storm.meltFrameCount;
		this.meltFrames = storm.meltFrames;
		this.meltFrame = 0;
		this.twinkleFrame = 0;
		this.active = 1;
		this.fontSize = (10 + (this.type / 5) * 10);
		this.o = doc.createElement('div');
		this.o.innerHTML = storm.snowCharacter;
		if (storm.className) {
			this.o.setAttribute('class', storm.className);
		}
		this.o.style.color = storm.snowColor;
		this.o.style.position = (fixedForEverything ? 'fixed' : 'absolute');
		if (storm.useGPU && features.transform.prop) {
			// GPU-accelerated snow.
			this.o.style[features.transform.prop] = 'translate3d(0px, 0px, 0px)';
		}
		this.o.style.width = storm.flakeWidth + 'px';
		this.o.style.height = storm.flakeHeight + 'px';
		this.o.style.fontFamily = 'arial,verdana';
		this.o.style.cursor = 'default';
		this.o.style.overflow = 'hidden';
		this.o.style.fontWeight = 'normal';
		this.o.style.zIndex = storm.zIndex;
		docFrag.appendChild(this.o);

		this.refresh = function () {
			if (isNaN(s.x) || isNaN(s.y)) {
				// safety check
				return false;
			}
			storm.setXY(s.o, s.x, s.y);
		};

		this.stick = function () {
			if (noFixed || (storm.targetElement !== doc.documentElement && storm.targetElement !== doc.body)) {
				s.o.style.top = (screenY + scrollY - storm.flakeHeight) + 'px';
			} else if (storm.flakeBottom) {
				s.o.style.top = storm.flakeBottom + 'px';
			} else {
				s.o.style.display = 'none';
				s.o.style.bottom = '0%';
				s.o.style.position = 'fixed';
				s.o.style.display = 'block';
			}
		};

		this.vCheck = function () {
			if (s.vX >= 0 && s.vX < 0.2) {
				s.vX = 0.2;
			} else if (s.vX < 0 && s.vX > -0.2) {
				s.vX = -0.2;
			}
			if (s.vY >= 0 && s.vY < 0.2) {
				s.vY = 0.2;
			}
		};

		this.move = function () {
			var vX = s.vX * windOffset, yDiff;
			s.x += vX;
			s.y += (s.vY * s.vAmp);
			if (s.x >= screenX || screenX - s.x < storm.flakeWidth) { // X-axis scroll check
				s.x = 0;
			} else if (vX < 0 && s.x - storm.flakeLeftOffset < -storm.flakeWidth) {
				s.x = screenX - storm.flakeWidth - 1; // flakeWidth;
			}
			s.refresh();
			yDiff = screenY + scrollY - s.y + storm.flakeHeight;
			if (yDiff < storm.flakeHeight) {
				s.active = 0;
				if (storm.snowStick) {
					s.stick();
				} else {
					s.recycle();
				}
			} else {
				if (storm.useMeltEffect && s.active && s.type < 3 && !s.melting && Math.random() > 0.998) {
					// ~1/1000 chance of melting mid-air, with each frame
					s.melting = true;
					s.melt();
					// only incrementally melt one frame
					// s.melting = false;
				}
				if (storm.useTwinkleEffect) {
					if (s.twinkleFrame < 0) {
						if (Math.random() > 0.97) {
							s.twinkleFrame = parseInt(Math.random() * 8, 10);
						}
					} else {
						s.twinkleFrame--;
						if (!opacitySupported) {
							s.o.style.visibility = (s.twinkleFrame && s.twinkleFrame % 2 === 0 ? 'hidden' : 'visible');
						} else {
							s.o.style.opacity = (s.twinkleFrame && s.twinkleFrame % 2 === 0 ? 0 : 1);
						}
					}
				}
			}
		};

		this.animate = function () {
			// main animation loop
			// move, check status, die etc.
			s.move();
		};

		this.setVelocities = function () {
			s.vX = vRndX + rnd(storm.vMaxX * 0.12, 0.1);
			s.vY = vRndY + rnd(storm.vMaxY * 0.12, 0.1);
		};

		this.setOpacity = function (o, opacity) {
			if (!opacitySupported) {
				return false;
			}
			o.style.opacity = opacity;
		};

		this.melt = function () {
			if (!storm.useMeltEffect || !s.melting) {
				s.recycle();
			} else {
				if (s.meltFrame < s.meltFrameCount) {
					s.setOpacity(s.o, s.meltFrames[s.meltFrame]);
					s.o.style.fontSize = s.fontSize - (s.fontSize * (s.meltFrame / s.meltFrameCount)) + 'px';
					s.o.style.lineHeight = storm.flakeHeight + 2 + (storm.flakeHeight * 0.75 * (s.meltFrame / s.meltFrameCount)) + 'px';
					s.meltFrame++;
				} else {
					s.recycle();
				}
			}
		};

		this.recycle = function () {
			s.o.style.display = 'none';
			s.o.style.position = (fixedForEverything ? 'fixed' : 'absolute');
			s.o.style.bottom = 'auto';
			s.setVelocities();
			s.vCheck();
			s.meltFrame = 0;
			s.melting = false;
			s.setOpacity(s.o, 1);
			s.o.style.padding = '0px';
			s.o.style.margin = '0px';
			s.o.style.fontSize = s.fontSize + 'px';
			s.o.style.lineHeight = (storm.flakeHeight + 2) + 'px';
			s.o.style.textAlign = 'center';
			s.o.style.verticalAlign = 'baseline';
			s.x = parseInt(rnd(screenX - storm.flakeWidth - 20), 10);
			s.y = parseInt(rnd(screenY) * -1, 10) - storm.flakeHeight;
			s.refresh();
			s.o.style.display = 'block';
			s.active = 1;
		};

		this.recycle(); // set up x/y coords etc.
		this.refresh();

	};

	_this.snow = function () {
		var active = 0, flake = null, i, j;
		for (i = 0, j = storm.flakes.length; i < j; i++) {
			if (storm.flakes[i].active === 1) {
				storm.flakes[i].move();
				active++;
			}
			if (storm.flakes[i].melting) {
				storm.flakes[i].melt();
			}
		}
		if (active < storm.flakesMaxActive) {
			flake = storm.flakes[parseInt(rnd(storm.flakes.length), 10)];
			if (flake.active === 0) {
				flake.melting = true;
			}
		}
		if (storm.timer) {
			features.getAnimationFrame(storm.snow);
		}
	};

	_this.mouseMove = function (e) {
		if (!storm.followMouse) {
			return true;
		}
		var x = parseInt(e.clientX, 10);
		if (x < screenX2) {
			windOffset = -windMultiplier + (x / screenX2 * windMultiplier);
		} else {
			x -= screenX2;
			windOffset = (x / screenX2) * windMultiplier;
		}
	};

	_this.createSnow = function (limit, allowInactive) {
		var i;
		for (i = 0; i < limit; i++) {
			storm.flakes[storm.flakes.length] = new storm.SnowFlake(parseInt(rnd(flakeTypes), 10));
			if (allowInactive || i > storm.flakesMaxActive) {
				storm.flakes[storm.flakes.length - 1].active = -1;
			}
		}
		storm.targetElement.appendChild(docFrag);
	};

	_this.timerInit = function () {
		storm.timer = true;
		storm.snow();
	};

	_this.init = function () {
		var i;
		for (i = 0; i < storm.meltFrameCount; i++) {
			storm.meltFrames.push(1 - (i / storm.meltFrameCount));
		}
		storm.randomizeWind();
		storm.createSnow(storm.flakesMax); // create initial batch
		storm.events.add(win, 'resize', storm.resizeHandler);
		//storm.events.add(win, 'scroll', storm.scrollHandler);
		if (storm.freezeOnBlur) {
			if (isIE) {
				storm.events.add(doc, 'focusout', storm.freeze);
				storm.events.add(doc, 'focusin', storm.resume);
			} else {
				storm.events.add(win, 'blur', storm.freeze);
				storm.events.add(win, 'focus', storm.resume);
			}
		}
		storm.resizeHandler();
		//storm.scrollHandler();
		if (storm.followMouse) {
			storm.events.add(isIE ? doc : win, 'mousemove', storm.mouseMove);
		}
		storm.animationInterval = Math.max(20, storm.animationInterval);
		storm.timerInit();
	};

	_this.start = function (bFromOnLoad) {
		if (!didInit) {
			didInit = true;
		} else if (bFromOnLoad) {
			// already loaded and running
			return true;
		}
		if (typeof storm.targetElement === 'string') {
			var targetID = storm.targetElement;
			storm.targetElement = doc.getElementById(targetID);
			if (!storm.targetElement) {
				throw new Error('Snowstorm: Unable to get targetElement "' + targetID + '"');
			}
		}
		if (!storm.targetElement) {
			storm.targetElement = (doc.body || doc.documentElement);
		}
		if (storm.targetElement !== doc.documentElement && storm.targetElement !== doc.body) {
			// re-map handler to get element instead of screen dimensions
			storm.resizeHandler = storm.resizeHandlerAlt;
			//and force-enable pixel positioning
			storm.usePixelPosition = true;
		}
		storm.resizeHandler(); // get bounding box elements
		storm.usePositionFixed = (storm.usePositionFixed && !noFixed && !storm.flakeBottom); // whether or not position:fixed is to be used
		if (win.getComputedStyle) {
			// attempt to determine if body or user-specified snow parent element is relatlively-positioned.
			try {
				targetElementIsRelative = (win.getComputedStyle(storm.targetElement, null).getPropertyValue('position') === 'relative');
			} catch (e) {
				// oh well
				targetElementIsRelative = false;
			}
		}
		//fixedForEverything = storm.usePositionFixed;
		if (screenX && screenY && !storm.disabled) {
			storm.init();
			storm.active = true;
		}
	};

	function doDelayedStart() {
		win.setTimeout(function () {
			storm.start(true);
		}, 20);
		// event cleanup
		storm.events.remove(isIE ? doc : win, 'mousemove', doDelayedStart);
	}

	doDelayedStart();
}