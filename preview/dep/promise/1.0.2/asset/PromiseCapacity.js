void function (define) {
    define('promise/PromiseCapacity', [
        'require',
        './util',
        './setImmediate'
    ], function (require) {
        var u = require('./util');
        var PENDING = 'pending';
        var FULFILLED = 'fulfilled';
        var REJECTED = 'rejected';
        var setImmediate = require('./setImmediate');
        var syncInvoke = function (fn) {
            fn();
        };
        function PromiseCapacity(promise) {
            this.promise = promise;
            this.status = PENDING;
            this.isResolved = false;
            this.result = undefined;
            this.fulfilledCallbacks = [];
            this.rejectedCallbacks = [];
            this.syncModeEnabled = false;
            this.invoke = setImmediate;
        }
        PromiseCapacity.onResolve = function (value) {
        };
        PromiseCapacity.onReject = function (reason) {
            typeof console !== 'undefined' && console.error(reason);
        };
        PromiseCapacity.prototype = {
            constructor: PromiseCapacity,
            resolve: function (value) {
                if (this.status !== PENDING || this.isResolved) {
                    return;
                }
                if (value === this.promise) {
                    this.reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
                    return;
                }
                try {
                    var then = u.getThen(value);
                    if (typeof then === 'function') {
                        chain(u.bind(then, value), this);
                        return;
                    }
                } catch (e) {
                    this.status === PENDING && this.reject(e);
                    return;
                }
                this.result = value;
                this.status = FULFILLED;
                this.constructor.onResolve.call(this.promise, value);
                exec(this);
            },
            reject: function (obj) {
                if (this.status !== PENDING || this.isResolved) {
                    return;
                }
                this.result = obj;
                this.status = REJECTED;
                this.constructor.onReject.call(this.promise, obj);
                exec(this);
            },
            then: function (onFulfilled, onRejected) {
                var capacity = this;
                this.syncModeEnabled = this.promise.syncModeEnabled;
                this.invoke = this.syncModeEnabled ? syncInvoke : setImmediate;
                var promise = new this.promise.constructor(function (resolve, reject) {
                        capacity.fulfilledCallbacks.push(createCallback(resolve, onFulfilled, resolve, reject));
                        capacity.rejectedCallbacks.push(createCallback(reject, onRejected, resolve, reject));
                    });
                promise.syncModeEnabled = this.syncModeEnabled;
                exec(this);
                return promise;
            }
        };
        function createCallback(method, callback, resolve, reject) {
            return function (value) {
                try {
                    if (typeof callback === 'function') {
                        value = callback(value);
                        method = resolve;
                    }
                    method(value);
                } catch (e) {
                    reject(e);
                }
            };
        }
        function chain(then, capacity) {
            capacity.isResolved = true;
            var chainedPromise = new capacity.promise.constructor(function (resolve, reject) {
                    var called = false;
                    try {
                        then(function (v) {
                            resolve(v);
                            called = true;
                        }, function (v) {
                            reject(v);
                            called = true;
                        });
                    } catch (e) {
                        !called && reject(e);
                    }
                });
            chainedPromise.then(function (v) {
                capacity.isResolved = false;
                capacity.resolve(v);
            }, function (v) {
                capacity.isResolved = false;
                capacity.reject(v);
            });
        }
        function exec(capacity) {
            if (capacity.status === PENDING) {
                return;
            }
            var callbacks = null;
            if (capacity.status === FULFILLED) {
                capacity.rejectedCallbacks = [];
                callbacks = capacity.fulfilledCallbacks;
            } else {
                capacity.fulfilledCallbacks = [];
                callbacks = capacity.rejectedCallbacks;
            }
            capacity.invoke(function () {
                var callback;
                var val = capacity.result;
                while (callback = callbacks.shift()) {
                    callback(val);
                }
            });
        }
        return PromiseCapacity;
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
}, this);