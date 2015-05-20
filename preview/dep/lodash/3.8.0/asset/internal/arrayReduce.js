/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/internal/arrayReduce",[],function(){function e(e,t,n,r){var i=-1,o=e.length;if(r&&o)n=e[++i];for(;++i<o;)n=t(n,e[i],i,e);return n}return e});