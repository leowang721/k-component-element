/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/internal/createFind",["./baseCallback","./baseFind","./baseFindIndex","../lang/isArray"],function(e,t,n,r){function i(i,a){return function(u,s,c){if(s=e(s,c,3),r(u)){var l=n(u,s,a);return l>-1?u[l]:o}return t(u,s,i)}}var o;return i});