/*! @2015 Leo Wang. All Rights Reserved */
define("emc/Collection",["require","eoo","mini-event/EventTarget"],function(require){var e={},t={silent:!0},exports={};exports.constructor=function(e){if(this.store=[],this.length=0,e)this.addArray(e,t)},exports.get=function(e){if(!this.store)throw new Error("This collection is disposed");if(null==e)throw new Error("Argument index is not provided");if(e=+e,isNaN(e))throw new Error("Argument index cannot convert to a number");if(!this.length)return void 0;if(0>e)e=this.length+e;if(0>e||e>=this.length)return void 0;var t=this.store[e];return t},exports.insert=function(t,n,r){if(!this.store)throw new Error("This collection is disposed");switch(arguments.length){case 0:throw new Error("Argument index is not provided");case 1:throw new Error("Argument item is not provided")}if(t=this.getValidIndex(t),r=r||e,this.store.splice(t,0,n),this.length=this.store.length,!r.silent)this.fire("add",{index:t,item:n});return n},exports.addAt=exports.insert,exports.add=function(e,t){if(!arguments.length)throw new Error("Argument item is not provided");this.insert(this.length,e,t)},exports.push=exports.add,exports.unshift=function(e,t){if(!arguments.length)throw new Error("Argument item is not provided");this.insert(0,e,t)},exports.removeAt=function(t,n){if(!this.store)throw new Error("This collection is disposed");var r=Math.min(this.length-1,this.getValidIndex(t));if(n=n||e,this.length){var i=this.store.splice(r,1)[0];if(this.length=this.store.length,!n.silent)this.fire("remove",{index:r,item:i})}},exports.pop=function(e){var t=this.get(-1);return this.removeAt(-1,e),t},exports.shift=function(e){var t=this.get(0);return this.removeAt(0,e),t},exports.remove=function(e,t){if(!arguments.length)throw new Error("Argument item is not provided");for(var n=this.indexOf(e);-1!==n;)this.removeAt(n,t),n=this.indexOf(e,n)},exports.indexOf=function(e,t){if(!this.store)throw new Error("This collection is disposed");if(!arguments.length)throw new Error("Argument item is not provided");t=t||0;for(var n=this.getValidIndex(t),r=n;r<this.length;r++)if(this.store[r]===e)return r;return-1},exports.dump=function(){return this.store?this.store.slice():[]},exports.clone=function(){if(!this.store)throw new Error("This collection is disposed");return new n(this.store)},exports.dispose=function(){this.destroyEvents(),this.store=null,this.length=void 0},exports.getValidIndex=function(e){if(null==e)throw new Error("Argument index is not provided");var t=+e;if(isNaN(t))throw new Error('Argument index (of value "'+e+'") cannot convert to a number');if(t>this.length)return this.length;if(0>t)return Math.max(this.length+t,0);else return t},exports.addArray=function(e,t){if("number"!=typeof e.length)throw new Error('Argument itmes (of value "'+e+'") is not an array');for(var n=0;n<e.length;n++)this.add(e[n],t)};var n=require("eoo").create(require("mini-event/EventTarget"),exports);return n});