/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/internal/createReduce",["./baseCallback","./baseReduce","../lang/isArray"],function(e,t,n){function r(r,o){return function(a,u,s,c){var l=arguments.length<3;return"function"==typeof u&&c===i&&n(a)?r(a,u,s,l):t(a,e(u,c,4),s,l,o)}}var i;return r});