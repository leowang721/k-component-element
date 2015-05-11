define('fc-storage/memory', [
    'require',
    'underscore',
    'eoo',
    'mini-event/EventTarget'
], function (require) {
    'use strict';
    var _ = require('underscore');
    var eoo = require('eoo');
    var EventTarget = require('mini-event/EventTarget');
    function getTypeString(target) {
        return Object.prototype.toString.call(target);
    }
    var proto = {};
    proto.constructor = function () {
        var data = {};
        this.supported = true;
        this.get = this.getItem = function (key) {
            return data[key];
        };
        this.set = this.setItem = function (key, value) {
            if (typeof key !== 'string' || !key) {
                throw new Error('\u9519\u8BEF\u7684storage.memory.setItem\u4F7F\u7528\uFF0C\u975E\u6CD5\u952E\u503C');
            }
            data[key] = value;
            this.fire('change');
            return this;
        };
        this.update = this.updateItem = function (key, value) {
            if (typeof key !== 'string' || !key) {
                throw new Error('\u9519\u8BEF\u7684storage.memory.updateItem\u4F7F\u7528\uFF0C' + '\u975E\u6CD5\u952E\u503C');
            }
            var origValue = this.getItem(key);
            if (getTypeString(origValue) !== getTypeString(value)) {
                this.setItem(key, value);
                this.fire('change');
                return value;
            }
            if (_.isArray(value) || _.isObject(value)) {
                this.setItem(key, _.deepExtend(origValue, value));
            } else {
                this.setItem(key, value);
            }
            this.fire('change');
            return value;
        };
        this.fill = function (source, opts) {
            if (!_.isObject(source) || _.isArray(source)) {
                throw new Error('\u9519\u8BEF\u7684storage.memory.fill\u4F7F\u7528\uFF0C' + '\u975E\u6CD5\u503C');
            }
            opts = opts || {};
            if (opts.update) {
                _.deepExtend(data, source);
            } else {
                _.extend(data, source);
            }
            this.fire('change');
            return this;
        };
        this.remove = this.removeItem = function (key) {
            delete data[key];
            this.fire('change');
            return this;
        };
        this.clear = function () {
            data = {};
            this.fire('change');
            return this;
        };
        this.dump = function () {
            return _.deepClone(data);
        };
    };
    var MemoryStorage = eoo.create(EventTarget, proto);
    var storage = new MemoryStorage();
    storage.createInstance = function () {
        return new MemoryStorage();
    };
    return storage;
});