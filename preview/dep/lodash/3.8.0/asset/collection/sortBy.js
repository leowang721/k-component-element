/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/collection/sortBy",["../internal/baseCallback","../internal/baseMap","../internal/baseSortBy","../internal/compareAscending","../internal/isIterateeCall"],function(e,t,n,r,i){function o(o,a,s){if(null==o)return[];if(s&&i(o,a,s))a=null;var u=-1;a=e(a,s,3);var c=t(o,function(e,t,n){return{criteria:a(e,t,n),index:++u,value:e}});return n(c,r)}return o});