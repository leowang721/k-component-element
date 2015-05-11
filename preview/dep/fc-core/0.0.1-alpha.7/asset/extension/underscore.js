define('fc-core/extension/underscore', [
    'require',
    'underscore'
], function (require) {
    var u = require('underscore');
    var util = {};
    util.purify = function purify(object, defaults, deep) {
        defaults = defaults || {};
        var purifiedObject = {};
        u.each(object, function (value, key) {
            var isDefaultNull = value == null || value === '';
            var isInDefaults = defaults.hasOwnProperty(key) && defaults[key] === value;
            if (!isDefaultNull && !isInDefaults) {
                if (deep && typeof value === 'object') {
                    purifiedObject[key] = purify(value, defaults[key], deep);
                } else {
                    purifiedObject[key] = value;
                }
            }
        });
        return purifiedObject;
    };
    util.trim = function (s) {
        return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
    util.pascalize = function (s) {
        s = s + '';
        if (/^[A-Z\-_]+$/.test(s)) {
            s = s.toLowerCase();
        }
        s = s.replace(/[\s-_]+(.)/g, function (w, c) {
            return c.toUpperCase();
        });
        s = s.charAt(0).toUpperCase() + s.slice(1);
        return s;
    };
    util.camelize = function (s) {
        s = util.pascalize(s);
        return s.charAt(0).toLowerCase() + s.slice(1);
    };
    util.dasherize = function (s) {
        s = util.pascalize(s);
        s = s.replace(/[A-Z]{2,}/g, function (match) {
            return match.charAt(0) + match.slice(1, -1).toLowerCase() + match.charAt(match.length - 1);
        });
        s = s.replace(/[A-Z]/g, function (match) {
            return '-' + match.toLowerCase();
        });
        if (s.charAt(0) === '-') {
            s = s.substring(1);
        }
        return s;
    };
    util.constanize = function (s) {
        s = util.pascalize(s);
        return s.toUpperCase();
    };
    util.pluralize = function (s) {
        return s.replace(/y$/, 'ie') + 's';
    };
    util.formatNumber = function (number, decimals, emptyValue, prefix) {
        if (typeof arguments[1] !== 'number') {
            prefix = arguments[2];
            emptyValue = arguments[1];
            decimals = 0;
        }
        prefix = prefix || '';
        emptyValue = emptyValue || '';
        if (number == null || isNaN(number)) {
            return prefix + emptyValue;
        }
        number = parseFloat(number).toFixed(decimals);
        var parts = number.split('.');
        var integer = parts[0];
        var decimal = parts[1];
        integer = integer.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        var result = prefix + integer;
        if (decimal) {
            result += '.' + decimal;
        }
        return result;
    };
    util.pad = function (s, padding, length) {
        s = s + '';
        var padLength = length - s.length;
        if (padLength > 0) {
            var left = new Array(padLength + 1).join(padding);
            return left + s;
        }
        return s;
    };
    util.padRight = function (s, padding, length) {
        s = s + '';
        var padLength = length - s.length;
        if (padLength > 0) {
            var right = new Array(padLength + 1).join(padding);
            return s + right;
        }
        return s;
    };
    util.deepClone = function (obj) {
        if (!u.isObject(obj) || u.isFunction(obj)) {
            return obj;
        }
        if (u.isArray(obj)) {
            return u.map(obj, util.deepClone);
        }
        var clone = {};
        u.each(obj, function (value, key) {
            clone[key] = util.deepClone(value);
        });
        return clone;
    };
    var toString = Object.prototype.toString;
    function deepExtend(target) {
        var length = arguments.length;
        if (length < 2) {
            return target;
        }
        for (var i = 1; i < length; i++) {
            simpleDeepExtend(arguments[0], arguments[i]);
        }
        return arguments[0];
    }
    function simpleDeepExtend(target, source) {
        for (var k in source) {
            if (!source.hasOwnProperty(k)) {
                continue;
            }
            var targetType = toString.call(target[k]);
            var sourceType = toString.call(source[k]);
            switch (sourceType) {
            case '[object Object]':
                if (targetType !== sourceType) {
                    target[k] = u.deepClone(source[k]);
                } else {
                    if (!target[k]) {
                        target[k] = u.deepClone(source[k]);
                    }
                    deepExtend(target[k], source[k]);
                }
                break;
            case '[object Array]':
                target[k] = u.deepClone(source[k]);
                break;
            default:
                target[k] = source[k];
            }
        }
        return target;
    }
    util.deepExtend = deepExtend;
    function activate() {
        u.mixin(util);
    }
    return { activate: u.once(activate) };
});