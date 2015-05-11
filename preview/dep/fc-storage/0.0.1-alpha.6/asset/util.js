define('fc-storage/util', [
    'require',
    'underscore'
], function (require) {
    var _ = require('underscore');
    function toString(target) {
        return Object.prototype.toString.call(target);
    }
    function extend(source, destination) {
        for (var key in destination) {
            if (destination.hasOwnProperty(key)) {
                source[key] = destination[key];
            }
        }
        return source;
    }
    var util = {
            getExtendedStorageMethods: function (storage) {
                var methods = {
                        getItem: function (key) {
                            var value = null;
                            try {
                                value = JSON.parse(storage.getItem(key));
                            } catch (e) {
                            }
                            return value;
                        },
                        setItem: function (key, value) {
                            if (typeof key !== 'string' || !key) {
                                throw new Error('\u9519\u8BEF\u7684storage.setItem\u4F7F\u7528\uFF0C\u975E\u6CD5\u952E\u503C');
                            }
                            storage.setItem(key, JSON.stringify(value));
                            this.fire('change');
                            return storage;
                        },
                        updateItem: function (key, value) {
                            if (typeof key !== 'string' || !key) {
                                throw new Error('\u9519\u8BEF\u7684storage.updateItem\u4F7F\u7528\uFF0C' + '\u975E\u6CD5\u952E\u503C');
                            }
                            var origValue = this.getItem(key);
                            if (toString(origValue) !== toString(value)) {
                                this.setItem(key, value);
                                this.fire('change');
                                return value;
                            }
                            if ($.isPlainObject(value)) {
                                this.setItem(key, extend(origValue, value));
                            } else {
                                this.setItem(key, value);
                            }
                            this.fire('change');
                            return this.getItem(key);
                        },
                        fill: function (source, opts) {
                            if (!_.isObject(source) || _.isArray(source)) {
                                throw new Error('\u9519\u8BEF\u7684storage.memory.fill\u4F7F\u7528\uFF0C' + '\u975E\u6CD5\u503C');
                            }
                            opts = opts || {};
                            var func = opts.update ? storage.updateItem : storage.setItem;
                            for (var k in source) {
                                if (source.hasOwnProperty(k)) {
                                    func.call(storage, k, source[k]);
                                }
                            }
                            this.fire('change');
                            return storage;
                        },
                        removeItem: function (key) {
                            storage.removeItem(key);
                            this.fire('change');
                        },
                        clear: function () {
                            storage.clear();
                            this.fire('change');
                        }
                    };
                methods.get = methods.getItem;
                methods.set = methods.setItem;
                methods.update = methods.updateItem;
                methods.remove = methods.removeItem;
                return methods;
            }
        };
    return util;
});