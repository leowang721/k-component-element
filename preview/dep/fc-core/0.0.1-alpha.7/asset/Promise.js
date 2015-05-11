define('fc-core/Promise', [
    'require',
    'promise'
], function (require) {
    'use strict';
    var Promise = require('promise');
    Promise.cast = Promise.cast || function (value) {
        if (value && typeof value === 'object' && value.constructor === this) {
            return value;
        }
        return new Promise(function (resolve) {
            resolve(value);
        });
    };
    function promiseRequire(modules) {
        var abort;
        var promise = new this(function (resolve, reject) {
                window.require(modules, resolve);
                abort = reject;
            });
        promise.abort = abort;
        return promise;
    }
    Promise.require = promiseRequire;
    return Promise;
});