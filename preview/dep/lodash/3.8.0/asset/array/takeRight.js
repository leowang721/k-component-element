/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/array/takeRight",["../internal/baseSlice","../internal/isIterateeCall"],function(e,t){function n(n,r,i){var o=n?n.length:0;if(!o)return[];if(i?t(n,r,i):null==r)r=1;return r=o-(+r||0),e(n,0>r?0:r)}return n});