;(function(window, document, undefined){

    var classes = [];

    var test = [];

    var ModernizrProto = {
        _version: '3.2.0',
        _config:{
            'classPrefix':'',
            'enableClasses': true,
            'enableJSClass': true,
            'usePrefixed': true
        },

        _q: [],

        on: function( test, cb ){

        },

        addTest: function(name, fn, options){

        },

        addAsyncTest: function(fn){

        }
    };

    var Modernizr = function(){};

    Modernizr.prototype = ModernizrProto;

    Modernizr = new Modernizr();

    function is(obj, type){

    }

    function testRunner(){

    }

    var docElement = document.documentElement;

    var isSVG = docElement.nodeName.toLowerCase() === 'svg';

    function setClasses( classes ){

    }

    var omPrefixes = 'Moz O ms Webkit';

    var cssomPrefixes = (ModernizrProto._config.usePrefixed ? omPrefixes.split(' ') : []);
    ModernizrProto._cssPrefixes = cssomPrefixes;

    var domPrefixes = ( ModernizrProto._config.usePrefixed ? omPrefixes.toLowerCase.split(' '): []);
    ModernizrProto._domPrefixes = domPrefixes;

    function contains( str, substr ){

    }

    function createElement(){

    }

    function cssToDOM(name){

    }

    function fnBind( fn, that ){

    }

    function testDomProps( props, obj, elem ){

    }

    var modElem = {
        elem: createElement('modernizr');
    };

    Modernizr._q.push(function(){
        delete modElem.elem;
    });

    var mStyle = {
        style.modElem.elem.style
    };

    Modernizr._q.unshift(function(){
        delete mStyle.style;
    });
})(window, document);