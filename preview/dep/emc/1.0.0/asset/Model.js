define('emc/Model', [
    'require',
    'eoo',
    'mini-event/EventTarget'
], function (require) {
    var EMPTY = {};
    var SILENT = { silent: true };
    var exports = {};
    exports.constructor = function (context) {
        this.store = {};
        if (context) {
            this.fill(context, SILENT);
        }
    };
    exports.get = function (name) {
        if (!this.store) {
            throw new Error('This model is disposed');
        }
        if (!name) {
            throw new Error('Argument name is not provided');
        }
        return this.store.hasOwnProperty(name) ? this.store[name] : undefined;
    };
    exports.set = function (name, value, options) {
        if (!this.store) {
            throw new Error('This model is disposed');
        }
        if (!name) {
            throw new Error('Argument name is not provided');
        }
        if (arguments.length < 2) {
            throw new Error('Argument value is not provided');
        }
        options = options || EMPTY;
        var changeType = this.store.hasOwnProperty(name) ? 'change' : 'add';
        var oldValue = this.store[name];
        this.store[name] = value;
        if (oldValue !== value && !options.silent) {
            var event = {
                    name: name,
                    oldValue: oldValue,
                    newValue: value,
                    changeType: changeType
                };
            this.fire('change', event);
            this.fire('change:' + name, event);
        }
    };
    exports.fill = function (extension, options) {
        if (!this.store) {
            throw new Error('This model is disposed');
        }
        if (!extension) {
            throw new Error('Argument extension is not provided');
        }
        for (var name in extension) {
            if (extension.hasOwnProperty(name)) {
                this.set(name, extension[name], options);
            }
        }
    };
    exports.remove = function (name, options) {
        if (!this.store) {
            throw new Error('This model is disposed');
        }
        if (!name) {
            throw new Error('Argument name is not provided');
        }
        if (!this.store.hasOwnProperty(name)) {
            return undefined;
        }
        options = options || EMPTY;
        var oldValue = this.store[name];
        delete this.store[name];
        if (!options.silent) {
            var event = {
                    name: name,
                    changeType: 'remove',
                    oldValue: oldValue,
                    newValue: undefined
                };
            this.fire('change', event);
            this.fire('change:' + name, event);
        }
    };
    exports.getAsModel = function (name) {
        var value = this.get(name);
        if (!value || {}.toString.call(value) !== '[object Object]') {
            return new Model();
        } else {
            return new Model(value);
        }
    };
    exports.dump = function () {
        var returnValue = {};
        for (var key in this.store) {
            if (this.store.hasOwnProperty(key)) {
                returnValue[key] = this.store[key];
            }
        }
        return returnValue;
    };
    exports.has = function (name) {
        if (!name) {
            throw new Error('Argument name is not provided');
        }
        if (!this.store) {
            return false;
        }
        return this.store.hasOwnProperty(name);
    };
    exports.hasValue = function (name) {
        if (!name) {
            throw new Error('Argument name is not provided');
        }
        if (!this.store) {
            return false;
        }
        return this.has(name) && this.store[name] != null;
    };
    exports.hasReadableValue = function (name) {
        if (!name) {
            throw new Error('Argument name is not provided');
        }
        if (!this.store) {
            return false;
        }
        return this.hasValue(name) && this.store[name] !== '';
    };
    exports.clone = function () {
        if (!this.store) {
            throw new Error('This model is disposed');
        }
        return new Model(this.store);
    };
    exports.dispose = function () {
        this.destroyEvents();
        this.store = null;
    };
    var Model = require('eoo').create(require('mini-event/EventTarget'), exports);
    return Model;
});