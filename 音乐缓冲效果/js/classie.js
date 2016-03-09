(function( window ){
'use strict';

function classReg( className ){
    return new RegExp( "(^|\\s+)"+className+"(\\s+|$)");
}

var hasClass, addClass, removeClass;

// classList兼容性：IE8,IE9不支持，FF，chrome支持良好
if( 'classList' in document.documentElement ){
    hasClass = function( elem, c ){
        return elem.classList.contains( c );
    };
    addClass = function( elem, c ){
        elem.classList.add( c );
    };
    removeClass = function( elem, c ){
        elem.classList.remove( c );
    };
} else {
    hasClass = function( elem, c ){
        return classReg( c ).test( elem.className ); 
    };

    addClass = function( elem, c ){
        if( !hasClass(elem, c) ){
            elem.className = elem.className + ' ' + c; 
        }
    };

    removeClass = function( elem, c ){
        elem.className = elem.className.replace( className(c), " " );
    }
}

function toggleClass( elem, c ){
    var fn = hasClass(elem, c) ? removeClass : addClass;
    fn( elem, c );
}

var classie = {
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,

    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
};

if( typeof define === 'function' && define.amd ){
    define( classie );
} else{
    window.classie = classie;
}
})(window);