/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/chain/lodash",["../internal/LazyWrapper","../internal/LodashWrapper","../internal/baseLodash","../lang/isArray","../internal/isObjectLike","../internal/wrapperClone"],function(e,t,n,r,i,o){function a(n){if(i(n)&&!r(n)&&!(n instanceof e)){if(n instanceof t)return n;if(u.call(n,"__chain__")&&u.call(n,"__wrapped__"))return o(n)}return new t(n)}var s=Object.prototype,u=s.hasOwnProperty;return a.prototype=n.prototype,a});