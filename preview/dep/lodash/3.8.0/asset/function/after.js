/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/function/after",["../internal/root"],function(e){function t(e,t){if("function"!=typeof t)if("function"==typeof e){var i=e;e=t,t=i}else throw new TypeError(n);return e=r(e=+e)?e:0,function(){if(--e<1)return t.apply(this,arguments);else return void 0}}var n="Expected a function",r=e.isFinite;return t});