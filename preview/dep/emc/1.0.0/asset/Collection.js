define('emc/Collection', [
    'require',
    'eoo',
    'mini-event/EventTarget'
], function (require) {
    var EMPTY = {};
    var SILENT = { silent: true };
    var exports = {};
    exports.constructor = function (items) {
        this.store = [];
        this.length = 0;
        if (items) {
            this.addArray(items, SILENT);
        }
    };
    exports.get = function (index) {
        if (!this.store) {
            throw new Error('This collection is disposed');
        }
        if (index == null) {
            throw new Error('Argument index is not provided');
        }
        index = +index;
        if (isNaN(index)) {
            throw new Error('Argument index cannot convert to a number');
        }
        if (!this.length) {
            return undefined;
        }
        if (index < 0) {
            index = this.length + index;
        }
        if (index < 0 || index >= this.length) {
            return undefined;
        }
        var item = this.store[index];
        return item;
    };
    exports.insert = function (index, item, options) {
        if (!this.store) {
            throw new Error('This collection is disposed');
        }
        switch (arguments.length) {
        case 0:
            throw new Error('Argument index is not provided');
        case 1:
            throw new Error('Argument item is not provided');
        }
        index = this.getValidIndex(index);
        options = options || EMPTY;
        this.store.splice(index, 0, item);
        this.length = this.store.length;
        if (!options.silent) {
            this.fire('add', {
                index: index,
                item: item
            });
        }
        return item;
    };
    exports.addAt = exports.insert;
    exports.add = function (item, options) {
        if (!arguments.length) {
            throw new Error('Argument item is not provided');
        }
        this.insert(this.length, item, options);
    };
    exports.push = exports.add;
    exports.unshift = function (item, options) {
        if (!arguments.length) {
            throw new Error('Argument item is not provided');
        }
        this.insert(0, item, options);
    };
    exports.removeAt = function (index, options) {
        if (!this.store) {
            throw new Error('This collection is disposed');
        }
        var actualIndex = Math.min(this.length - 1, this.getValidIndex(index));
        options = options || EMPTY;
        if (!this.length) {
            return;
        }
        var removedItem = this.store.splice(actualIndex, 1)[0];
        this.length = this.store.length;
        if (!options.silent) {
            this.fire('remove', {
                index: actualIndex,
                item: removedItem
            });
        }
    };
    exports.pop = function (options) {
        var lastItem = this.get(-1);
        this.removeAt(-1, options);
        return lastItem;
    };
    exports.shift = function (options) {
        var firstItem = this.get(0);
        this.removeAt(0, options);
        return firstItem;
    };
    exports.remove = function (item, options) {
        if (!arguments.length) {
            throw new Error('Argument item is not provided');
        }
        var startIndex = this.indexOf(item);
        while (startIndex !== -1) {
            this.removeAt(startIndex, options);
            startIndex = this.indexOf(item, startIndex);
        }
    };
    exports.indexOf = function (item, startIndex) {
        if (!this.store) {
            throw new Error('This collection is disposed');
        }
        if (!arguments.length) {
            throw new Error('Argument item is not provided');
        }
        startIndex = startIndex || 0;
        var actualStartIndex = this.getValidIndex(startIndex);
        for (var i = actualStartIndex; i < this.length; i++) {
            if (this.store[i] === item) {
                return i;
            }
        }
        return -1;
    };
    exports.dump = function () {
        return this.store ? this.store.slice() : [];
    };
    exports.clone = function () {
        if (!this.store) {
            throw new Error('This collection is disposed');
        }
        return new Collection(this.store);
    };
    exports.dispose = function () {
        this.destroyEvents();
        this.store = null;
        this.length = undefined;
    };
    exports.getValidIndex = function (index) {
        if (index == null) {
            throw new Error('Argument index is not provided');
        }
        var validIndex = +index;
        if (isNaN(validIndex)) {
            throw new Error('Argument index (of value "' + index + '") cannot convert to a number');
        }
        if (validIndex > this.length) {
            return this.length;
        }
        if (validIndex < 0) {
            return Math.max(this.length + validIndex, 0);
        }
        return validIndex;
    };
    exports.addArray = function (items, options) {
        if (typeof items.length !== 'number') {
            throw new Error('Argument itmes (of value "' + items + '") is not an array');
        }
        for (var i = 0; i < items.length; i++) {
            this.add(items[i], options);
        }
    };
    var Collection = require('eoo').create(require('mini-event/EventTarget'), exports);
    return Collection;
});