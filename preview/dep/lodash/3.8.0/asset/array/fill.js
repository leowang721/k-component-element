/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/array/fill",["../internal/baseFill","../internal/isIterateeCall"],function(e,t){function n(n,r,i,o){var a=n?n.length:0;if(!a)return[];if(i&&"number"!=typeof i&&t(n,r,i))i=0,o=a;return e(n,r,i,o)}return n});