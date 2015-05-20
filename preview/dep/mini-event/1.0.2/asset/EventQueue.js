/*! @2015 Leo Wang. All Rights Reserved */
define("mini-event/EventQueue",["require","./lib"],function(require){function e(e,n,t){return e&&e.handler===n&&e.thisObject==t}function n(){this.queue=[]}var t=require("./lib");return n.prototype.add=function(n,r){if(n!==!1&&"function"!=typeof n)throw new Error("event handler must be a function or const false");var i={handler:n};t.extend(i,r);for(var o=0;o<this.queue.length;o++){var a=this.queue[o];if(e(a,n,i.thisObject))return}this.queue.push(i)},n.prototype.remove=function(n,t){if(!n)return void this.clear();for(var r=0;r<this.queue.length;r++){var i=this.queue[r];if(e(i,n,t))return void(this.queue[r]=null)}},n.prototype.clear=function(){this.queue.length=0},n.prototype.execute=function(e,n){for(var t=this.queue,r=0;r<t.length;r++){if("function"==typeof e.isImmediatePropagationStopped&&e.isImmediatePropagationStopped())return;var i=t[r];if(i){var o=i.handler;if(o===!1){if("function"==typeof e.preventDefault)e.preventDefault();if("function"==typeof e.stopPropagation)e.stopPropagation()}else o.call(i.thisObject||n,e);if(i.once)this.remove(i.handler,i.thisObject)}else;}},n.prototype.getLength=function(){for(var e=0,n=0;n<this.queue.length;n++)if(this.queue[n])e++;return e},n.prototype.length=n.prototype.getLength,n.prototype.dispose=function(){this.clear(),this.queue=null},n});