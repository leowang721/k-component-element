/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/internal/toPath",["./baseToString","../lang/isArray"],function(e,t){function n(n){if(t(n))return n;var o=[];return e(n).replace(r,function(e,t,n,r){o.push(n?r.replace(i,"$1"):t||e)}),o}var r=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,i=/\\(\\)?/g;return n});