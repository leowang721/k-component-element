define('fc-core/Enum', [
    'require',
    'underscore',
    'eoo'
], function (require) {
    var u = require('underscore');
    var exports = {};
    exports.constructor = function () {
        this.valueIndex = [];
        this.aliasIndex = {};
        this.textIndex = {};
        for (var i = 0; i < arguments.length; i++) {
            this.addElement(arguments[i]);
        }
    };
    exports.addElement = function (element) {
        if (typeof element !== 'object') {
            throw new Error('Argument element is not provided');
        }
        element = u.clone(element);
        if (typeof element.text !== 'string') {
            throw new Error('Enum item must contain a "text" property of type string');
        }
        if (typeof element.alias !== 'string') {
            throw new Error('Enum item must contain a "alias" property of type string');
        }
        if (element.value == null) {
            element.value = this.valueIndex.length;
        }
        if (this.hasOwnProperty(element.value)) {
            throw new Error('Already defined an element with value' + element.value + ' in this enum type');
        }
        if (this.hasOwnProperty(element.alias)) {
            throw new Error('Already defined an element with alias "' + element.alias + '" in this enum type');
        }
        this[element.value] = element.alias;
        this[element.alias] = element.value;
        this.valueIndex[element.value] = element;
        this.aliasIndex[element.alias] = element;
        this.textIndex[element.text] = element;
    };
    exports.fromValue = function (value) {
        return this.valueIndex.hasOwnProperty(value) ? u.clone(this.valueIndex[value]) : null;
    };
    exports.fromAlias = function (alias) {
        return this.aliasIndex.hasOwnProperty(alias) ? u.clone(this.aliasIndex[alias]) : null;
    };
    exports.fromText = function (text) {
        return this.textIndex.hasOwnProperty(text) ? u.clone(this.textIndex[text]) : null;
    };
    exports.getTextFromValue = function (value) {
        var element = this.fromValue(value);
        return element ? element.text : null;
    };
    exports.getTextFromAlias = function (alias) {
        var element = this.fromAlias(alias);
        return element ? element.text : null;
    };
    exports.getValueFromAlias = function (alias) {
        var element = this.fromAlias(alias);
        return element ? element.value : null;
    };
    exports.getValueFromText = function (text) {
        var element = this.fromText(text);
        return element ? element.value : null;
    };
    exports.getAliasFromValue = function (value) {
        var element = this.fromValue(value);
        return element ? element.alias : null;
    };
    exports.getAliasFromText = function (text) {
        var element = this.fromText(text);
        return element ? element.alias : null;
    };
    exports.toArray = function () {
        var array = [];
        var i;
        if (arguments.length > 0) {
            for (i = 0; i < arguments.length; i++) {
                var hint = arguments[i];
                if (typeof hint === 'string') {
                    array.push(this.fromAlias(hint));
                } else {
                    array.push(hint);
                }
            }
        } else {
            for (i = 0; i < this.valueIndex.length; i++) {
                if (this.valueIndex[i]) {
                    array.push(this.valueIndex[i]);
                }
            }
        }
        return array;
    };
    var Enum = require('eoo').create(exports);
    return Enum;
});