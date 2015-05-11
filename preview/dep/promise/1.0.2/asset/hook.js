void function (define) {
    define('promise/hook', [
        'require',
        './PromiseCapacity'
    ], function (require) {
        var PromiseCapacity = require('./PromiseCapacity');
        return function (Promise) {
            Promise.onReject = function (handler) {
                if (typeof handler === 'function') {
                    PromiseCapacity.onReject = handler;
                }
            };
            Promise.onResolve = function (handler) {
                if (typeof handler === 'function') {
                    PromiseCapacity.onResolve = handler;
                }
            };
            return Promise;
        };
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
}, this);