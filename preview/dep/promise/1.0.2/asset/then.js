/*! @2015 Leo Wang. All Rights Reserved */
void function(e){e("promise/then",["require","./util"],function(require){function e(e){return function(n){return n[e]}}function n(e){return function(){return e}}function t(){}var r=require("./util");return function(i){return i.prototype.thenGetProperty=function(n){return this.then(e(n))},i.prototype.thenReturn=function(e){return this.then(n(e))},i.prototype.thenBind=function(){return this.then(r.bind.apply(r,arguments))},i.prototype.thenSwallowException=function(){return this["catch"](t)},i}})}("function"==typeof define&&define.amd?define:function(e){module.exports=e(require)},this);