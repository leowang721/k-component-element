void function (define) {
    define('promise/util', ['require'], function (require) {
        var util = {};
        var nativeBind = Function.prototype.bind;
        if (typeof nativeBind === 'function') {
            util.bind = function (fn) {
                return nativeBind.apply(fn, [].slice.call(arguments, 1));
            };
        } else {
            util.bind = function (fn, thisObject) {
                var extraArgs = [].slice.call(arguments, 2);
                return function () {
                    var args = extraArgs.concat([].slice.call(arguments));
                    return fn.apply(thisObject, args);
                };
            };
        }
        util.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };
        util.getThen = function (promise) {
            return promise && (typeof promise === 'object' || typeof promise === 'function') && promise.then;
        };
        return util;
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
}, this);