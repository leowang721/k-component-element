/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/string/pad",["../internal/baseToString","../internal/createPadding","../internal/root"],function(e,n,t){function r(t,r,u){t=e(t),r=+r;var l=t.length;if(l>=r||!a(r))return t;var c=(r-l)/2,f=o(c),s=i(c);return u=n("",s,u),u.slice(0,f)+t+u}var i=Math.ceil,o=Math.floor,a=t.isFinite;return r});