void function (define, global, undefined) {
    define('promise/Promise', [
        'require',
        './util',
        './PromiseCapacity'
    ], function (require) {
        var u = require('./util');
        var PromiseCapacity = require('./PromiseCapacity');
        function Promise(executor) {
            if (typeof executor !== 'function') {
                throw new TypeError('Promise resolver undefined is not a function');
            }
            if (!(this instanceof Promise)) {
                throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, ' + 'this object constructor cannot be called as a function.');
            }
            var capacity = new PromiseCapacity(this);
            this.then = u.bind(capacity.then, capacity);
            executor(u.bind(capacity.resolve, capacity), u.bind(capacity.reject, capacity));
        }
        Promise.prototype.then = function (onFulfilled, onReject) {
        };
        Promise.prototype['catch'] = function (onRejected) {
            return this.then(null, onRejected);
        };
        Promise.resolve = function (value) {
            return new Promise(function (resolve) {
                resolve(value);
            });
        };
        Promise.reject = function (obj) {
            return new Promise(function (resolve, reject) {
                reject(obj);
            });
        };
        Promise.all = function (promises) {
            var Promise = this;
            if (!u.isArray(promises)) {
                throw new TypeError('You must pass an array to all.');
            }
            return new Promise(function (resolve, reject) {
                var results = [];
                var remaining = promises.length;
                var promise = null;
                if (remaining === 0) {
                    resolve([]);
                }
                function resolver(index) {
                    return function (value) {
                        resolveAll(index, value);
                    };
                }
                function resolveAll(index, value) {
                    results[index] = value;
                    if (--remaining === 0) {
                        resolve(results);
                    }
                }
                for (var i = 0, len = promises.length; i < len; i++) {
                    promise = promises[i];
                    var then = u.getThen(promise);
                    if (typeof then === 'function') {
                        promise.then(resolver(i), reject);
                    } else {
                        resolveAll(i, promise);
                    }
                }
            });
        };
        Promise.race = function (promises) {
            var Promise = this;
            if (!u.isArray(promises)) {
                throw new TypeError('You must pass an array to race.');
            }
            return new Promise(function (resolve, reject) {
                for (var i = 0, len = promises.length; i < len; i++) {
                    var promise = promises[i];
                    var then = u.getThen(promise);
                    if (typeof then === 'function') {
                        then.call(promise, resolve, reject);
                    } else {
                        resolve(promise);
                    }
                }
            });
        };
        return Promise;
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
}, this);