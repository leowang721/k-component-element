void function (define, global) {
    define('promise/enhance', [
        'require',
        './util'
    ], function (require) {
        var u = require('./util');
        function isPromise(obj) {
            return typeof u.getThen(obj) === 'function';
        }
        function promiseRequire(modules) {
            var isAborted = false;
            var promise = new this(function (resolve, reject) {
                    global.require(modules, function () {
                        !isAborted && resolve([].slice.call(arguments));
                    });
                });
            promise.abort = function () {
                isAborted = true;
            };
            return promise;
        }
        function ensure(callback) {
            var Promise = this.constructor;
            return this.then(function (value) {
                Promise.resolve(callback()).then(function () {
                    return value;
                });
            }, function (reason) {
                Promise.resolve(callback()).then(function () {
                    throw reason;
                });
            });
        }
        function invoke(fn, thisObj, args) {
            try {
                args = [].slice.call(arguments, 2);
                var value = fn.apply(thisObj, args);
                return isPromise(value) ? value : this.resolve(value);
            } catch (e) {
                return this.reject(e);
            }
        }
        function cast(value) {
            if (value && typeof value === 'object' && value.constructor === this) {
                return value;
            }
            return new this(function (resolve) {
                resolve(value);
            });
        }
        return function (Promise) {
            Promise.isPromise = isPromise;
            Promise.require = promiseRequire;
            Promise.invoke = invoke;
            Promise.cast = cast;
            Promise.prototype['finally'] = ensure;
            Promise.prototype.ensure = ensure;
            Promise.prototype.fail = Promise.prototype['catch'];
            return Promise;
        };
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
}, this);