/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/internal/baseFindIndex",[],function(){function e(e,t,n){for(var r=e.length,i=n?r:-1;n?i--:++i<r;)if(t(e[i],i,e))return i;return-1}return e});