/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/internal/invokePath",["./baseGet","./baseSlice","./isKey","../array/last","./toPath"],function(e,t,n,r,i){function o(o,u,s){if(null!=o&&!n(u,o))u=i(u),o=1==u.length?o:e(o,t(u,0,-1)),u=r(u);var c=null==o?o:o[u];return null==c?a:c.apply(o,s)}var a;return o});