/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/internal/arrayReduceRight",[],function(){function e(e,t,n,r){var i=e.length;if(r&&i)n=e[--i];for(;i--;)n=t(n,e[i],i,e);return n}return e});