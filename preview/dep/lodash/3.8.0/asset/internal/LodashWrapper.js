/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/internal/LodashWrapper",["./baseCreate","./baseLodash"],function(e,t){function n(e,t,n){this.__wrapped__=e,this.__actions__=n||[],this.__chain__=!!t}return n.prototype=e(t.prototype),n.prototype.constructor=n,n});