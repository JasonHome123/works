;(function(){
	'use strict';

	// 定义贝塞尔曲线运动
	// from http://stackoverflow.com/a/25273333
	// 是为了解决将贝塞尔曲线运动运用在snap.svg.js中而设置的此函数
	var bazier = function( x1, y1, x2, y2, epsilon ){
		var curveX = function(t){
			var v = 1 - t;
			return 3 * v * v * t * x1 + 3 * v * t * t *x2 + t * t * t;
		};
		var curveY = function(t){
			var v = 1 - t;
			return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
		};

		var derivativeCurveX = function(t){
			var v = 1 - t;
			return 3 * ( 2 * ( t - 1) * t + v * v ) * x1 + 3 * (-t * t * t + 2 * v * t) * x2;
		};

		return function( t ){
			var x = t, t0, t1, t2, x2,d2, i;

			for( x2 = x, i = 0; i < 8; i++ ){
				x2 = curveX( t2 ) - x;
				if( Math.abs(x2) < epsilon ) return curveY(t2);
				d2 = derivativeCurveX(t2);
				if( Math.abs(d2) < 1e-6) break;
				t2 = t2 - x2 / d2;
			}

			t0 = 0, t1 = 1, t2 = x;

			if( t2 < t0 ) return curveX( t0 );
			if( t2 > t1 ) return curveY( t1 );

			while( t0 < t1 ){
				x2 = curveX(t2);
				if (Math.abs(x2 - x) < epsilon) return curveY(t2);
				if (x > x2) t0 = t2;
				else t1 = t2;
				t2 = (t1 - t0) * .5 + t0;
			}

			return curveY(t2);
		}
	},

	// 得到一个min, max之间的随机数
	getRandomNumber = function( min, max ){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	// 函数节流，让频繁事件触发更稀疏提高性能，eg: move,reisze事件，及时搜索功能。
	// fn为事件响应函数，delay为间隔时间
	throttle = function( fn, delay ){
		var allowSample = true;

		return function( e ){
			if( allowSample ){
				allowSample = false;
				setTimeout(function(){
					allowSample = true;
				}, delay);
				fn( e );
			}
		}
	},

	// 用javascript去获取浏览器的前缀
	prefix = (function(){
			// 拿到元素在此浏览器中所有的css属性
		var styles = window.getComputedStyle(document.documentElement, ''),
			// 返回webkit
			pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['','o']))[1],
			dom = ('Webkit|Moz|MS|O').match(new RegExp('('+pre+')', 'i'))[1];

			/*
			 * {
			 *     dom: Webkit,
			 *     lowercase: webkit,
			 *     css: -webkit-,
			 *     js: Webkit
			 * }
			 */
			return{
				dom: dom,
				lowercase: pre,
				css: '-' + pre + '-',
				js: pre[0].toUpperCase() + pre.substr(1)
			};
	})();

	// support.transtions得到一个是否支持transition的boolean值
	var support = {transitions: Modernizr.csstransitions},

		// 确定transitionend事件的名称
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd', // Saf 6, Android Browser
			'MozTransition' : 'transitionend', // only for FF < 15
			'OTransition': 'oTransitionEnd', 
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend' // IE10, Opera, Chrome, FF 15+, Saf 7+
		},
		/* Modernizr.prefixed( prop, [obj],[elem])
		 * 他接受一个css样式值，如果是形如box-sizing的样式则用驼峰形式boxSizing表示
		 * 返回一个浏览器实际支持版本的属性值字符串，如WebkitTransition
		 * 有些浏览器直接支持不见前缀的transition,如果浏览器什么都不支持直接返回false
		*/
		transEndEventName = transEndEventNames[ Modernizr.prefixed('transition')],
		
		onEndTransition = function( el, callback, propTest ){
			var onEndCallbackFn = function( ev ){
				if( support.transitions ){
					if( ev.target != this || propTest && ev.propertyName !== propTest && ev.propertyName !== prefix.css + propTest ) return;
					this.removeEventListener( transEndEventName, onEndCallbackFn );
				}

				if( callback && typeof callback === 'function' ){

					callback.call(this);
				}
			};

			if( support.transitions ){
				el.addEventListener( transEndEventName, onEndCallbackFn );
			} else {
				onEndCallbackFn();
			}
		},
		
		shzEl = document.querySelector('.component'),
		shzCtrl = shzEl.querySelector('button.button--start'),
		shzSVGEl = shzEl.querySelector('svg.morpher'),
		

		snap = Snap( shzSVGEl ),

		// 匹配css选择器，只选择匹配元素中的第一个元素
		shzPathEl = snap.select('path'),

		// 视图中音乐图标的最大个数
		totalNotes = 50,

		// 用于存放音乐图标元素
		notes,

		notesSpeedFactor = 4.5,

		// 收集音乐符号的时间
		simulateTime = 6500,


		winsize = {
			width: window.innerWidth,
			height: window.innerHeight
		},

		shzCtrlOffset = shzCtrl.getBoundingClientRect(),

		shzCtrlSize = {
			width: shzCtrl.offsetWidth,
			height: shzCtrl.offsetHeight
		},

		// 表示音乐图标
		isListening = false,

		playerEl = shzEl.querySelector('.player'),

		playerCloseCtrl = playerEl.querySelector('.button--close');


	function init(){
		createNotes();
		initEvents();
	}

	// 创建音乐图标部分
	function createNotes(){
		var notesEl = document.createElement('div'),
			notesElContent = '';

		notesEl.className = 'notes';

		for( var i = 0; i < totalNotes; ++i ){
			// 让j的数字始终保持在1-6的范围之内
			var j = (i + 1) - 6 * Math.floor(i/6);
			notesElContent += '<div class="note icon icon--note'+j+'"></div>';
		}
		notesEl.innerHTML = notesElContent;
		shzEl.insertBefore( notesEl, shzEl.firstChild);

		notes = [].slice.call( notesEl.querySelectorAll('.note'));
	}

	// 定义事件
	function initEvents(){
		shzCtrl.addEventListener('click', listen);

		playerCloseCtrl.addEventListener('click', closePlayer);

		window.addEventListener('resize', throttle(function(ev){
			winsize = {
				width: window.innerWidth,
				height: window.innerHeight
			};
			shzCtrlOffset = shzCtrl.getBoundingClientRect();
		}, 10));
	}

	function listen(){
		isListening = true;

		classie.remove(shzCtrl, 'button--start');
		classie.add( shzCtrl, 'button--listen');

		animatePath( shzPathEl, shzEl.getAttribute('data-path-listen'), 400, [0.8, -0.6, 0.2, 1], function(){
			classie.add( shzCtrl, 'button--animate');
			showNotes();
			setTimeout( showPlayer, simulateTime);
		});
	}

	function stopListening(){
		isListening = false;

		classie.remove( shzCtrl, 'button--animate');

		hideNotes();
	}

	function animatePath( el, path, duration, timingFunction, callback){
		// duration的传入是为了让snap元素很好的使用贝塞尔曲线
		var epsilon = (1000/60/duration)/4,
		timingFunction = typeof timingFunction == 'function'? timingFunction : bazier(timingFunction[0], timingFunction[1], timingFunction[2], timingFunction[3], epsilon);

		// stop,animate是snap的方法么？？
		el.stop().animate({'path': path}, duration, timingFunction, callback);
	}

	function showNotes(){
		notes.forEach(function(note){
			positionNote(note);
			animateNote(note);
		});
	}

	function hideNotes(){
		notes.forEach(function(note){
			note.style.opacity = 0;
		})
	}

	// 给音乐图标定位...
	function positionNote( note ){
	
		var x = getRandomNumber( -2 * (shzCtrlOffset.left + shzCtrlSize.width/2), 2*(winsize.width - (shzCtrlOffset.left + shzCtrlSize.width/2))),
			y,
			rotation = getRandomNumber( -30, 30 );


		// 这部分代码计算是为了防止音乐图标突然的在屏幕内部生成
		if( x > -1 * (shzCtrlOffset.top + shzCtrlSize.height/2) && x < shzCtrlOffset.top + shzCtrlSize.height/2){
			
			y = getRandomNumber(0,1) > 0 ? getRandomNumber( -2 * (shzCtrlOffset.top + shzCtrlSize.height/2), -1*(shzCtrlOffset.top + shzCtrlSize.height/2)) :
				getRandomNumber( winsize.height - (shzCtrlOffset.top + shzCtrlSize.height/2), winsize.height + winsize.height - (shzCtrlOffset.top + shzCtrlSize.height/2));
			
		}else{
			y = getRandomNumber( -2 * (shzCtrlOffset.top + shzCtrlOffset.height/2), winsize.height + winsize.height - (shzCtrlOffset.top + shzCtrlOffset.height/2));
		}


		note.style.WebkitTransition = note.style.transition = 'none';
		note.style.WebkitTransform = note.style.transform = 'translate3d(' + x + 'px, ' + y + 'px,0) rotate3d(0,0,1,'+rotation+'deg)';

		note.setAttribute('data-tx', Math.abs(x));
		note.setAttribute('data-ty', Math.abs(y));
	}

	function animateNote( note ){
		setTimeout(function(){
			if( !isListening ) return;

			// 计算图标运动到原点需要花多久的时间
			// 但是这个算法根据什么我就不是太清楚了。
			var noteSpeed = notesSpeedFactor * Math.sqrt( Math.pow(note.getAttribute('data-tx'),2) + Math.pow(note.getAttribute('data-ty'),2));

			note.style.WebkitTransition = '-webkit-transform ' + noteSpeed + 'ms ease-in, opacity 0.8s';
			note.style.transition = 'transform '+ noteSpeed + 'ms ease-in, opacity 0.8s';

			note.style.WebkitTransform = note.style.transform = 'translate3d(0,0,0)';
			note.style.opacity = 1;

			var onEndTransitionCallback = function(){
				note.style.WebkitTransition = note.style.transition = 'none';
				note.style.opacity = 0;
				if( !isListening ) return;
				positionNote( note );
				animateNote( note );
			};

			onEndTransition( note, onEndTransitionCallback, 'transform');
		}, 60)
	}

	function showPlayer(){
		stopListening();

		setTimeout(function(){
			animatePath( shzPathEl, shzEl.getAttribute('data-path-player'), 450, [0.7, 0, 0.3, 1], function(){
				classie.remove( playerEl, 'player--hidden');
			});

			classie.add( shzCtrl, 'button-hidden');
		}, 250);

		classie.remove( shzCtrl, 'button--listen');
	}

	function closePlayer(){
		classie.add( playerEl, 'player--hidden');

		animatePath( shzPathEl, shzEl.getAttribute('data-path-start'), 400, [0.4, 1, 0.3, 1]);

		setTimeout(function(){
			classie.remove( shzCtrl, 'button--hidden');
			classie.add( shzCtrl, 'button--start');
		}, 50)
	}

	init();
})(window);