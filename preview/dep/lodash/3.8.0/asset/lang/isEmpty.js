/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/lang/isEmpty",["./isArguments","./isArray","../internal/isArrayLike","./isFunction","../internal/isObjectLike","./isString","../object/keys"],function(e,t,n,r,i,o,a){function u(u){if(null==u)return!0;if(n(u)&&(t(u)||o(u)||e(u)||i(u)&&r(u.splice)))return!u.length;else return!a(u).length}return u});