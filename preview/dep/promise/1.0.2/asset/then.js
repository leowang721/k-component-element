void function (define, global) {
    define('promise/then', [
        'require',
        './util'
    ], function (require) {
        var u = require('./util');
        function getProperty(propertyName) {
            return function (result) {
                return result[propertyName];
            };
        }
        function returnValue(value) {
            return function () {
                return value;
            };
        }
        function noop() {
        }
        return function (Promise) {
            Promise.prototype.thenGetProperty = function (propertyName) {
                return this.then(getProperty(propertyName));
            };
            Promise.prototype.thenReturn = function (value) {
                return this.then(returnValue(value));
            };
            Promise.prototype.thenBind = function () {
                return this.then(u.bind.apply(u, arguments));
            };
            Promise.prototype.thenSwallowException = function () {
                return this['catch'](noop);
            };
            return Promise;
        };
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
}, this);