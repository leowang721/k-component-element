define('fc-core/aop', ['require'], function (require) {
    'use strict';
    var aop = {};
    aop.before = function (context, methodName, aspectMethod) {
        if (!aspectMethod) {
            return;
        }
        var original = context[methodName];
        context[methodName] = function () {
            try {
                aspectMethod.apply(this, arguments);
            } finally {
                return original.apply(this, arguments);
            }
        };
    };
    aop.beforeReject = function (context, methodName, aspectMethod) {
        if (!aspectMethod) {
            return;
        }
        var original = context[methodName];
        context[methodName] = function () {
            if (aspectMethod.apply(this, arguments)) {
                return original.apply(this, arguments);
            }
        };
    };
    aop.after = function (context, methodName, aspectMethod) {
        if (!aspectMethod) {
            return;
        }
        var original = context[methodName];
        context[methodName] = function () {
            var result = original.apply(this, arguments);
            try {
                aspectMethod.apply(this, arguments);
            } finally {
                return result;
            }
        };
    };
    aop.around = function (context, methodName, beforeMethod, afterMethod) {
        aop.before(context, methodName, beforeMethod);
        aop.after(context, methodName, afterMethod);
    };
    return aop;
});

define('fc-core/assert', ['require'], function (require) {
    'use strict';
    var search = window.location.search.substring(1);
    var assert;
    if (window.DEBUG || /\bdebug\b/g.test(search)) {
        assert = function (condition, message) {
            if (!condition) {
                throw new Error(message);
            }
        };
        assert.has = function (obj, message) {
            assert(obj != null, message);
        };
        assert.equals = function (x, y, message) {
            assert(x === y, message);
        };
        assert.hasProperty = function (obj, propertyName, message) {
            assert(obj[propertyName] != null, message);
        };
        assert.lessThan = function (value, max, message) {
            assert(value < max, message);
        };
        assert.greaterThan = function (value, min, message) {
            assert(value > min, message);
        };
        assert.lessThanOrEquals = function (value, max, message) {
            assert(value <= max, message);
        };
        assert.greaterThanOrEquals = function (value, min, message) {
            assert(value >= min, message);
        };
        return assert;
    }
    assert = function () {
    };
    assert.has = assert;
    assert.equals = assert;
    assert.hasProperty = assert;
    assert.lessThan = assert;
    assert.greaterThan = assert;
    assert.lessThanOrEquals = assert;
    assert.greaterThanOrEquals = assert;
    return assert;
});

define('underscore/underscore', [
    'require',
    'exports',
    'module'
], function (require, exports, module) {
    (function () {
        var root = this;
        var previousUnderscore = root._;
        var breaker = {};
        var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
        var push = ArrayProto.push, slice = ArrayProto.slice, concat = ArrayProto.concat, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
        var nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind;
        var _ = function (obj) {
            if (obj instanceof _)
                return obj;
            if (!(this instanceof _))
                return new _(obj);
            this._wrapped = obj;
        };
        if (typeof exports !== 'undefined') {
            if (typeof module !== 'undefined' && module.exports) {
                exports = module.exports = _;
            }
            exports._ = _;
        } else {
            root._ = _;
        }
        _.VERSION = '1.6.0';
        var createCallback = function (func, context, argCount) {
            if (context === void 0)
                return func;
            switch (argCount == null ? 3 : argCount) {
            case 1:
                return function (value) {
                    return func.call(context, value);
                };
            case 2:
                return function (value, other) {
                    return func.call(context, value, other);
                };
            case 3:
                return function (value, index, collection) {
                    return func.call(context, value, index, collection);
                };
            case 4:
                return function (accumulator, value, index, collection) {
                    return func.call(context, accumulator, value, index, collection);
                };
            }
            return function () {
                return func.apply(context, arguments);
            };
        };
        var lookupIterator = function (value, context, argCount) {
            if (value == null)
                return _.identity;
            if (_.isFunction(value))
                return createCallback(value, context, argCount);
            if (_.isObject(value))
                return _.matches(value);
            return _.property(value);
        };
        _.each = _.forEach = function (obj, iterator, context) {
            var i, length;
            if (obj == null)
                return obj;
            iterator = createCallback(iterator, context);
            if (obj.length === +obj.length) {
                for (i = 0, length = obj.length; i < length; i++) {
                    if (iterator(obj[i], i, obj) === breaker)
                        break;
                }
            } else {
                var keys = _.keys(obj);
                for (i = 0, length = keys.length; i < length; i++) {
                    if (iterator(obj[keys[i]], keys[i], obj) === breaker)
                        break;
                }
            }
            return obj;
        };
        _.map = _.collect = function (obj, iterator, context) {
            var results = [];
            if (obj == null)
                return results;
            iterator = lookupIterator(iterator, context);
            _.each(obj, function (value, index, list) {
                results.push(iterator(value, index, list));
            });
            return results;
        };
        var reduceError = 'Reduce of empty array with no initial value';
        _.reduce = _.foldl = _.inject = function (obj, iterator, memo, context) {
            var initial = arguments.length > 2;
            if (obj == null)
                obj = [];
            iterator = createCallback(iterator, context, 4);
            _.each(obj, function (value, index, list) {
                if (!initial) {
                    memo = value;
                    initial = true;
                } else {
                    memo = iterator(memo, value, index, list);
                }
            });
            if (!initial)
                throw TypeError(reduceError);
            return memo;
        };
        _.reduceRight = _.foldr = function (obj, iterator, memo, context) {
            var initial = arguments.length > 2;
            if (obj == null)
                obj = [];
            var length = obj.length;
            iterator = createCallback(iterator, context, 4);
            if (length !== +length) {
                var keys = _.keys(obj);
                length = keys.length;
            }
            _.each(obj, function (value, index, list) {
                index = keys ? keys[--length] : --length;
                if (!initial) {
                    memo = obj[index];
                    initial = true;
                } else {
                    memo = iterator(memo, obj[index], index, list);
                }
            });
            if (!initial)
                throw TypeError(reduceError);
            return memo;
        };
        _.find = _.detect = function (obj, predicate, context) {
            var result;
            predicate = lookupIterator(predicate, context);
            _.some(obj, function (value, index, list) {
                if (predicate(value, index, list)) {
                    result = value;
                    return true;
                }
            });
            return result;
        };
        _.filter = _.select = function (obj, predicate, context) {
            var results = [];
            if (obj == null)
                return results;
            predicate = lookupIterator(predicate, context);
            _.each(obj, function (value, index, list) {
                if (predicate(value, index, list))
                    results.push(value);
            });
            return results;
        };
        _.reject = function (obj, predicate, context) {
            return _.filter(obj, _.negate(lookupIterator(predicate)), context);
        };
        _.every = _.all = function (obj, predicate, context) {
            var result = true;
            if (obj == null)
                return result;
            predicate = lookupIterator(predicate, context);
            _.each(obj, function (value, index, list) {
                result = predicate(value, index, list);
                if (!result)
                    return breaker;
            });
            return !!result;
        };
        _.some = _.any = function (obj, predicate, context) {
            var result = false;
            if (obj == null)
                return result;
            predicate = lookupIterator(predicate, context);
            _.each(obj, function (value, index, list) {
                result = predicate(value, index, list);
                if (result)
                    return breaker;
            });
            return !!result;
        };
        _.contains = _.include = function (obj, target) {
            if (obj == null)
                return false;
            if (obj.length === +obj.length)
                return _.indexOf(obj, target) >= 0;
            return _.some(obj, function (value) {
                return value === target;
            });
        };
        _.invoke = function (obj, method) {
            var args = slice.call(arguments, 2);
            var isFunc = _.isFunction(method);
            return _.map(obj, function (value) {
                return (isFunc ? method : value[method]).apply(value, args);
            });
        };
        _.pluck = function (obj, key) {
            return _.map(obj, _.property(key));
        };
        _.where = function (obj, attrs) {
            return _.filter(obj, _.matches(attrs));
        };
        _.findWhere = function (obj, attrs) {
            return _.find(obj, _.matches(attrs));
        };
        _.max = function (obj, iterator, context) {
            var result = -Infinity, lastComputed = -Infinity, value, computed;
            if (!iterator && _.isArray(obj)) {
                for (var i = 0, length = obj.length; i < length; i++) {
                    value = obj[i];
                    if (value > result) {
                        result = value;
                    }
                }
            } else {
                iterator = lookupIterator(iterator, context);
                _.each(obj, function (value, index, list) {
                    computed = iterator(value, index, list);
                    if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                        result = value;
                        lastComputed = computed;
                    }
                });
            }
            return result;
        };
        _.min = function (obj, iterator, context) {
            var result = Infinity, lastComputed = Infinity, value, computed;
            if (!iterator && _.isArray(obj)) {
                for (var i = 0, length = obj.length; i < length; i++) {
                    value = obj[i];
                    if (value < result) {
                        result = value;
                    }
                }
            } else {
                iterator = lookupIterator(iterator, context);
                _.each(obj, function (value, index, list) {
                    computed = iterator(value, index, list);
                    if (computed < lastComputed || computed === Infinity && result === Infinity) {
                        result = value;
                        lastComputed = computed;
                    }
                });
            }
            return result;
        };
        _.shuffle = function (obj) {
            var rand;
            var index = 0;
            var shuffled = [];
            _.each(obj, function (value) {
                rand = _.random(index++);
                shuffled[index - 1] = shuffled[rand];
                shuffled[rand] = value;
            });
            return shuffled;
        };
        _.sample = function (obj, n, guard) {
            if (n == null || guard) {
                if (obj.length !== +obj.length)
                    obj = _.values(obj);
                return obj[_.random(obj.length - 1)];
            }
            return _.shuffle(obj).slice(0, Math.max(0, n));
        };
        _.sortBy = function (obj, iterator, context) {
            iterator = lookupIterator(iterator, context);
            return _.pluck(_.map(obj, function (value, index, list) {
                return {
                    value: value,
                    index: index,
                    criteria: iterator(value, index, list)
                };
            }).sort(function (left, right) {
                var a = left.criteria;
                var b = right.criteria;
                if (a !== b) {
                    if (a > b || a === void 0)
                        return 1;
                    if (a < b || b === void 0)
                        return -1;
                }
                return left.index - right.index;
            }), 'value');
        };
        var group = function (behavior) {
            return function (obj, iterator, context) {
                var result = {};
                iterator = lookupIterator(iterator, context);
                _.each(obj, function (value, index) {
                    var key = iterator(value, index, obj);
                    behavior(result, value, key);
                });
                return result;
            };
        };
        _.groupBy = group(function (result, value, key) {
            if (_.has(result, key))
                result[key].push(value);
            else
                result[key] = [value];
        });
        _.indexBy = group(function (result, value, key) {
            result[key] = value;
        });
        _.countBy = group(function (result, value, key) {
            if (_.has(result, key))
                result[key]++;
            else
                result[key] = 1;
        });
        _.sortedIndex = function (array, obj, iterator, context) {
            iterator = lookupIterator(iterator, context, 1);
            var value = iterator(obj);
            var low = 0, high = array.length;
            while (low < high) {
                var mid = low + high >>> 1;
                if (iterator(array[mid]) < value)
                    low = mid + 1;
                else
                    high = mid;
            }
            return low;
        };
        _.toArray = function (obj) {
            if (!obj)
                return [];
            if (_.isArray(obj))
                return slice.call(obj);
            if (obj.length === +obj.length)
                return _.map(obj, _.identity);
            return _.values(obj);
        };
        _.size = function (obj) {
            if (obj == null)
                return 0;
            return obj.length === +obj.length ? obj.length : _.keys(obj).length;
        };
        _.partition = function (obj, predicate, context) {
            predicate = lookupIterator(predicate, context);
            var pass = [], fail = [];
            _.each(obj, function (value, key, obj) {
                (predicate(value, key, obj) ? pass : fail).push(value);
            });
            return [
                pass,
                fail
            ];
        };
        _.first = _.head = _.take = function (array, n, guard) {
            if (array == null)
                return void 0;
            if (n == null || guard)
                return array[0];
            if (n < 0)
                return [];
            return slice.call(array, 0, n);
        };
        _.initial = function (array, n, guard) {
            return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
        };
        _.last = function (array, n, guard) {
            if (array == null)
                return void 0;
            if (n == null || guard)
                return array[array.length - 1];
            return slice.call(array, Math.max(array.length - n, 0));
        };
        _.rest = _.tail = _.drop = function (array, n, guard) {
            return slice.call(array, n == null || guard ? 1 : n);
        };
        _.compact = function (array) {
            return _.filter(array, _.identity);
        };
        var flatten = function (input, shallow, strict, output) {
            if (shallow && _.every(input, _.isArray)) {
                return concat.apply(output, input);
            }
            for (var i = 0, length = input.length; i < length; i++) {
                var value = input[i];
                if (!_.isArray(value) && !_.isArguments(value)) {
                    if (!strict)
                        output.push(value);
                } else if (shallow) {
                    push.apply(output, value);
                } else {
                    flatten(value, shallow, strict, output);
                }
            }
            return output;
        };
        _.flatten = function (array, shallow) {
            return flatten(array, shallow, false, []);
        };
        _.without = function (array) {
            return _.difference(array, slice.call(arguments, 1));
        };
        _.uniq = _.unique = function (array, isSorted, iterator, context) {
            if (array == null)
                return [];
            if (_.isFunction(isSorted)) {
                context = iterator;
                iterator = isSorted;
                isSorted = false;
            }
            if (iterator)
                iterator = lookupIterator(iterator, context);
            var result = [];
            var seen = [];
            for (var i = 0, length = array.length; i < length; i++) {
                var value = array[i];
                if (iterator)
                    value = iterator(value, i, array);
                if (isSorted ? !i || seen !== value : !_.contains(seen, value)) {
                    if (isSorted)
                        seen = value;
                    else
                        seen.push(value);
                    result.push(array[i]);
                }
            }
            return result;
        };
        _.union = function () {
            return _.uniq(flatten(arguments, true, true, []));
        };
        _.intersection = function (array) {
            if (array == null)
                return [];
            var result = [];
            var argsLength = arguments.length;
            for (var i = 0, length = array.length; i < length; i++) {
                var item = array[i];
                if (_.contains(result, item))
                    continue;
                for (var j = 1; j < argsLength; j++) {
                    if (!_.contains(arguments[j], item))
                        break;
                }
                if (j === argsLength)
                    result.push(item);
            }
            return result;
        };
        _.difference = function (array) {
            var rest = flatten(slice.call(arguments, 1), true, true, []);
            return _.filter(array, function (value) {
                return !_.contains(rest, value);
            });
        };
        _.zip = function (array) {
            if (array == null)
                return [];
            var length = _.max(arguments, 'length').length;
            var results = Array(length);
            for (var i = 0; i < length; i++) {
                results[i] = _.pluck(arguments, i);
            }
            return results;
        };
        _.object = function (list, values) {
            if (list == null)
                return {};
            var result = {};
            for (var i = 0, length = list.length; i < length; i++) {
                if (values) {
                    result[list[i]] = values[i];
                } else {
                    result[list[i][0]] = list[i][1];
                }
            }
            return result;
        };
        _.indexOf = function (array, item, isSorted) {
            if (array == null)
                return -1;
            var i = 0, length = array.length;
            if (isSorted) {
                if (typeof isSorted == 'number') {
                    i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
                } else {
                    i = _.sortedIndex(array, item);
                    return array[i] === item ? i : -1;
                }
            }
            for (; i < length; i++)
                if (array[i] === item)
                    return i;
            return -1;
        };
        _.lastIndexOf = function (array, item, from) {
            if (array == null)
                return -1;
            var i = from == null ? array.length : from;
            while (i--)
                if (array[i] === item)
                    return i;
            return -1;
        };
        _.range = function (start, stop, step) {
            if (arguments.length <= 1) {
                stop = start || 0;
                start = 0;
            }
            step = arguments[2] || 1;
            var length = Math.max(Math.ceil((stop - start) / step), 0);
            var idx = 0;
            var range = Array(length);
            while (idx < length) {
                range[idx++] = start;
                start += step;
            }
            return range;
        };
        var Ctor = function () {
        };
        _.bind = function (func, context) {
            var args, bound;
            if (nativeBind && func.bind === nativeBind)
                return nativeBind.apply(func, slice.call(arguments, 1));
            if (!_.isFunction(func))
                throw TypeError('Bind must be called on a function');
            args = slice.call(arguments, 2);
            bound = function () {
                if (!(this instanceof bound))
                    return func.apply(context, args.concat(slice.call(arguments)));
                Ctor.prototype = func.prototype;
                var self = new Ctor();
                Ctor.prototype = null;
                var result = func.apply(self, args.concat(slice.call(arguments)));
                if (Object(result) === result)
                    return result;
                return self;
            };
            return bound;
        };
        _.partial = function (func) {
            var boundArgs = slice.call(arguments, 1);
            return function () {
                var position = 0;
                var args = boundArgs.slice();
                for (var i = 0, length = args.length; i < length; i++) {
                    if (args[i] === _)
                        args[i] = arguments[position++];
                }
                while (position < arguments.length)
                    args.push(arguments[position++]);
                return func.apply(this, args);
            };
        };
        _.bindAll = function (obj) {
            var i = 1, length = arguments.length, key;
            if (length <= 1)
                throw Error('bindAll must be passed function names');
            for (; i < length; i++) {
                key = arguments[i];
                obj[key] = createCallback(obj[key], obj, Infinity);
            }
            return obj;
        };
        _.memoize = function (func, hasher) {
            var memoize = function (key) {
                var cache = memoize.cache;
                var address = hasher ? hasher.apply(this, arguments) : key;
                if (!_.has(cache, address))
                    cache[address] = func.apply(this, arguments);
                return cache[key];
            };
            memoize.cache = {};
            return memoize;
        };
        _.delay = function (func, wait) {
            var args = slice.call(arguments, 2);
            return setTimeout(function () {
                return func.apply(null, args);
            }, wait);
        };
        _.defer = function (func) {
            return _.delay.apply(_, [
                func,
                1
            ].concat(slice.call(arguments, 1)));
        };
        _.throttle = function (func, wait, options) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            if (!options)
                options = {};
            var later = function () {
                previous = options.leading === false ? 0 : _.now();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout)
                    context = args = null;
            };
            return function () {
                var now = _.now();
                if (!previous && options.leading === false)
                    previous = now;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0 || remaining > wait) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout)
                        context = args = null;
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        };
        _.debounce = function (func, wait, immediate) {
            var timeout, args, context, timestamp, result;
            var later = function () {
                var last = _.now() - timestamp;
                if (last < wait && last > 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                        if (!timeout)
                            context = args = null;
                    }
                }
            };
            return function () {
                context = this;
                args = arguments;
                timestamp = _.now();
                var callNow = immediate && !timeout;
                if (!timeout)
                    timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }
                return result;
            };
        };
        _.once = function (func) {
            var ran = false, memo;
            return function () {
                if (ran)
                    return memo;
                ran = true;
                memo = func.apply(this, arguments);
                func = null;
                return memo;
            };
        };
        _.wrap = function (func, wrapper) {
            return _.partial(wrapper, func);
        };
        _.negate = function (predicate) {
            return function () {
                return !predicate.apply(this, arguments);
            };
        };
        _.compose = function () {
            var funcs = arguments;
            return function () {
                var args = arguments;
                for (var i = funcs.length - 1; i >= 0; i--) {
                    args = [funcs[i].apply(this, args)];
                }
                return args[0];
            };
        };
        _.after = function (times, func) {
            return function () {
                if (--times < 1) {
                    return func.apply(this, arguments);
                }
            };
        };
        _.keys = function (obj) {
            if (!_.isObject(obj))
                return [];
            if (nativeKeys)
                return nativeKeys(obj);
            var keys = [];
            for (var key in obj)
                if (_.has(obj, key))
                    keys.push(key);
            return keys;
        };
        _.values = function (obj) {
            var keys = _.keys(obj);
            var length = keys.length;
            var values = Array(length);
            for (var i = 0; i < length; i++) {
                values[i] = obj[keys[i]];
            }
            return values;
        };
        _.pairs = function (obj) {
            var keys = _.keys(obj);
            var length = keys.length;
            var pairs = Array(length);
            for (var i = 0; i < length; i++) {
                pairs[i] = [
                    keys[i],
                    obj[keys[i]]
                ];
            }
            return pairs;
        };
        _.invert = function (obj) {
            var result = {};
            var keys = _.keys(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
                result[obj[keys[i]]] = keys[i];
            }
            return result;
        };
        _.functions = _.methods = function (obj) {
            var names = [];
            for (var key in obj) {
                if (_.isFunction(obj[key]))
                    names.push(key);
            }
            return names.sort();
        };
        _.extend = function (obj) {
            if (!_.isObject(obj))
                return obj;
            var source, prop;
            for (var i = 1, length = arguments.length; i < length; i++) {
                source = arguments[i];
                for (prop in source) {
                    obj[prop] = source[prop];
                }
            }
            return obj;
        };
        _.pick = function (obj, iterator, context) {
            var result = {}, key;
            if (_.isFunction(iterator)) {
                for (key in obj) {
                    var value = obj[key];
                    if (iterator.call(context, value, key, obj))
                        result[key] = value;
                }
            } else {
                var keys = concat.apply([], slice.call(arguments, 1));
                for (var i = 0, length = keys.length; i < length; i++) {
                    key = keys[i];
                    if (key in obj)
                        result[key] = obj[key];
                }
            }
            return result;
        };
        _.omit = function (obj, iterator, context) {
            if (_.isFunction(iterator)) {
                iterator = _.negate(iterator);
            } else {
                var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
                iterator = function (value, key) {
                    return !_.contains(keys, key);
                };
            }
            return _.pick(obj, iterator, context);
        };
        _.defaults = function (obj) {
            if (!_.isObject(obj))
                return obj;
            for (var i = 1, length = arguments.length; i < length; i++) {
                var source = arguments[i];
                for (var prop in source) {
                    if (obj[prop] === void 0)
                        obj[prop] = source[prop];
                }
            }
            return obj;
        };
        _.clone = function (obj) {
            if (!_.isObject(obj))
                return obj;
            return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
        };
        _.tap = function (obj, interceptor) {
            interceptor(obj);
            return obj;
        };
        var eq = function (a, b, aStack, bStack) {
            if (a === b)
                return a !== 0 || 1 / a === 1 / b;
            if (a == null || b == null)
                return a === b;
            if (a instanceof _)
                a = a._wrapped;
            if (b instanceof _)
                b = b._wrapped;
            var className = toString.call(a);
            if (className !== toString.call(b))
                return false;
            switch (className) {
            case '[object RegExp]':
            case '[object String]':
                return '' + a === '' + b;
            case '[object Number]':
                if (a != +a)
                    return b != +b;
                return a == 0 ? 1 / a == 1 / b : a == +b;
            case '[object Date]':
            case '[object Boolean]':
                return +a === +b;
            }
            if (typeof a != 'object' || typeof b != 'object')
                return false;
            var length = aStack.length;
            while (length--) {
                if (aStack[length] === a)
                    return bStack[length] === b;
            }
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && 'constructor' in a && 'constructor' in b && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) {
                return false;
            }
            aStack.push(a);
            bStack.push(b);
            var size, result;
            if (className === '[object Array]') {
                size = a.length;
                result = size === b.length;
                if (result) {
                    while (size--) {
                        if (!(result = eq(a[size], b[size], aStack, bStack)))
                            break;
                    }
                }
            } else {
                var keys = _.keys(a), key;
                size = keys.length;
                result = _.keys(b).length == size;
                if (result) {
                    while (size--) {
                        key = keys[size];
                        if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack)))
                            break;
                    }
                }
            }
            aStack.pop();
            bStack.pop();
            return result;
        };
        _.isEqual = function (a, b) {
            return eq(a, b, [], []);
        };
        _.isEmpty = function (obj) {
            if (obj == null)
                return true;
            if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))
                return obj.length === 0;
            for (var key in obj)
                if (_.has(obj, key))
                    return false;
            return true;
        };
        _.isElement = function (obj) {
            return !!(obj && obj.nodeType === 1);
        };
        _.isArray = nativeIsArray || function (obj) {
            return toString.call(obj) === '[object Array]';
        };
        _.isObject = function (obj) {
            return obj === Object(obj);
        };
        _.each([
            'Arguments',
            'Function',
            'String',
            'Number',
            'Date',
            'RegExp'
        ], function (name) {
            _['is' + name] = function (obj) {
                return toString.call(obj) === '[object ' + name + ']';
            };
        });
        if (!_.isArguments(arguments)) {
            _.isArguments = function (obj) {
                return _.has(obj, 'callee');
            };
        }
        if (typeof /./ !== 'function') {
            _.isFunction = function (obj) {
                return typeof obj === 'function';
            };
        }
        _.isFinite = function (obj) {
            return isFinite(obj) && !isNaN(parseFloat(obj));
        };
        _.isNaN = function (obj) {
            return _.isNumber(obj) && obj !== +obj;
        };
        _.isBoolean = function (obj) {
            return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
        };
        _.isNull = function (obj) {
            return obj === null;
        };
        _.isUndefined = function (obj) {
            return obj === void 0;
        };
        _.has = function (obj, key) {
            return obj != null && hasOwnProperty.call(obj, key);
        };
        _.noConflict = function () {
            root._ = previousUnderscore;
            return this;
        };
        _.identity = function (value) {
            return value;
        };
        _.constant = function (value) {
            return function () {
                return value;
            };
        };
        _.noop = function () {
        };
        _.property = function (key) {
            return function (obj) {
                return obj[key];
            };
        };
        _.matches = function (attrs) {
            return function (obj) {
                if (obj == null)
                    return _.isEmpty(attrs);
                if (obj === attrs)
                    return true;
                for (var key in attrs)
                    if (attrs[key] !== obj[key])
                        return false;
                return true;
            };
        };
        _.times = function (n, iterator, context) {
            var accum = Array(Math.max(0, n));
            iterator = createCallback(iterator, context, 1);
            for (var i = 0; i < n; i++)
                accum[i] = iterator(i);
            return accum;
        };
        _.random = function (min, max) {
            if (max == null) {
                max = min;
                min = 0;
            }
            return min + Math.floor(Math.random() * (max - min + 1));
        };
        _.now = Date.now || function () {
            return new Date().getTime();
        };
        var entityMap = {
                escape: {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    '\'': '&#x27;'
                }
            };
        entityMap.unescape = _.invert(entityMap.escape);
        var entityRegexes = {
                escape: RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
                unescape: RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
            };
        _.each([
            'escape',
            'unescape'
        ], function (method) {
            _[method] = function (string) {
                if (string == null)
                    return '';
                return ('' + string).replace(entityRegexes[method], function (match) {
                    return entityMap[method][match];
                });
            };
        });
        _.result = function (object, property) {
            if (object == null)
                return void 0;
            var value = object[property];
            return _.isFunction(value) ? object[property]() : value;
        };
        var idCounter = 0;
        _.uniqueId = function (prefix) {
            var id = ++idCounter + '';
            return prefix ? prefix + id : id;
        };
        _.templateSettings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        };
        var noMatch = /(.)^/;
        var escapes = {
                '\'': '\'',
                '\\': '\\',
                '\r': 'r',
                '\n': 'n',
                '\u2028': 'u2028',
                '\u2029': 'u2029'
            };
        var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
        var escapeChar = function (match) {
            return '\\' + escapes[match];
        };
        _.template = function (text, data, settings) {
            settings = _.defaults({}, settings, _.templateSettings);
            var matcher = RegExp([
                    (settings.escape || noMatch).source,
                    (settings.interpolate || noMatch).source,
                    (settings.evaluate || noMatch).source
                ].join('|') + '|$', 'g');
            var index = 0;
            var source = '__p+=\'';
            text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
                source += text.slice(index, offset).replace(escaper, escapeChar);
                index = offset + match.length;
                if (escape) {
                    source += '\'+\n((__t=(' + escape + '))==null?\'\':_.escape(__t))+\n\'';
                } else if (interpolate) {
                    source += '\'+\n((__t=(' + interpolate + '))==null?\'\':__t)+\n\'';
                } else if (evaluate) {
                    source += '\';\n' + evaluate + '\n__p+=\'';
                }
                return match;
            });
            source += '\';\n';
            if (!settings.variable)
                source = 'with(obj||{}){\n' + source + '}\n';
            source = 'var __t,__p=\'\',__j=Array.prototype.join,' + 'print=function(){__p+=__j.call(arguments,\'\');};\n' + source + 'return __p;\n';
            try {
                var render = Function(settings.variable || 'obj', '_', source);
            } catch (e) {
                e.source = source;
                throw e;
            }
            if (data)
                return render(data, _);
            var template = function (data) {
                return render.call(this, data, _);
            };
            var argument = settings.variable || 'obj';
            template.source = 'function(' + argument + '){\n' + source + '}';
            return template;
        };
        _.chain = function (obj) {
            var instance = _(obj);
            instance._chain = true;
            return instance;
        };
        var result = function (obj) {
            return this._chain ? _(obj).chain() : obj;
        };
        _.mixin = function (obj) {
            _.each(_.functions(obj), function (name) {
                var func = _[name] = obj[name];
                _.prototype[name] = function () {
                    var args = [this._wrapped];
                    push.apply(args, arguments);
                    return result.call(this, func.apply(_, args));
                };
            });
        };
        _.mixin(_);
        _.each([
            'pop',
            'push',
            'reverse',
            'shift',
            'sort',
            'splice',
            'unshift'
        ], function (name) {
            var method = ArrayProto[name];
            _.prototype[name] = function () {
                var obj = this._wrapped;
                method.apply(obj, arguments);
                if ((name === 'shift' || name === 'splice') && obj.length === 0)
                    delete obj[0];
                return result.call(this, obj);
            };
        });
        _.each([
            'concat',
            'join',
            'slice'
        ], function (name) {
            var method = ArrayProto[name];
            _.prototype[name] = function () {
                return result.call(this, method.apply(this._wrapped, arguments));
            };
        });
        _.prototype.value = function () {
            return this._wrapped;
        };
    }.call(this));
});

define('underscore', ['underscore/underscore'], function ( main ) { return main; });

void function (define) {
    define('eoo/oo', [], function () {
        var Empty = function () {
        };
        var NAME_PROPERTY_NAME = '__eooName__';
        var OWNER_PROPERTY_NAME = '__eooOwner__';
        function Class() {
            return Class.create.apply(Class, arguments);
        }
        Class.create = function (BaseClass, overrides) {
            overrides = overrides || {};
            BaseClass = BaseClass || Class;
            if (typeof BaseClass === 'object') {
                overrides = BaseClass;
                BaseClass = Class;
            }
            var kclass = inherit(BaseClass);
            var proto = kclass.prototype;
            eachObject(overrides, function (value, key) {
                if (typeof value === 'function') {
                    value[NAME_PROPERTY_NAME] = key;
                    value[OWNER_PROPERTY_NAME] = kclass;
                }
                proto[key] = value;
            });
            kclass.toString = toString;
            return kclass;
        };
        Class.static = typeof Object.create === 'function' ? Object.create : function (o) {
            if (arguments.length > 1) {
                throw new Error('Second argument not supported');
            }
            if (!(o instanceof Object)) {
                throw new TypeError('Argument must be an object');
            }
            Empty.prototype = o;
            return new Empty();
        };
        Class.toString = function () {
            return 'function Class() { [native code] }';
        };
        Class.prototype = {
            constructor: function () {
            },
            $self: Class,
            $superClass: Object,
            $super: function (args) {
                var method = this.$super.caller;
                var name = method[NAME_PROPERTY_NAME];
                var superClass = method[OWNER_PROPERTY_NAME].$superClass;
                var superMethod = superClass.prototype[name];
                if (typeof superMethod !== 'function') {
                    throw new TypeError('Call the super class\'s ' + name + ', but it is not a function!');
                }
                return superMethod.apply(this, args);
            }
        };
        function inherit(BaseClass) {
            var kclass = function () {
                return kclass.prototype.constructor.apply(this, arguments);
            };
            Empty.prototype = BaseClass.prototype;
            var proto = kclass.prototype = new Empty();
            proto.$self = kclass;
            if (!('$super' in proto)) {
                proto.$super = Class.prototype.$super;
            }
            kclass.$superClass = BaseClass;
            return kclass;
        }
        var hasEnumBug = !{ toString: 1 }.propertyIsEnumerable('toString');
        var enumProperties = [
                'constructor',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'toString',
                'toLocaleString',
                'valueOf'
            ];
        function hasOwnProperty(obj, key) {
            return Object.prototype.hasOwnProperty.call(obj, key);
        }
        function eachObject(obj, fn) {
            for (var k in obj) {
                hasOwnProperty(obj, k) && fn(obj[k], k, obj);
            }
            if (hasEnumBug) {
                for (var i = enumProperties.length - 1; i > -1; --i) {
                    var key = enumProperties[i];
                    hasOwnProperty(obj, key) && fn(obj[key], key, obj);
                }
            }
        }
        function toString() {
            return this.prototype.constructor.toString();
        }
        return Class;
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
});

void function (define, undefined) {
    define('eoo/defineAccessor', ['require'], function (require) {
        var MEMBERS = '__eooPrivateMembers__';
        function simpleGetter(name) {
            var body = 'return typeof this.' + MEMBERS + ' === \'object\' ? this.' + MEMBERS + '[\'' + name + '\'] : undefined;';
            return new Function(body);
        }
        function simpleSetter(name) {
            var body = 'this.' + MEMBERS + ' = this.' + MEMBERS + ' || {};\n' + 'this.' + MEMBERS + '[\'' + name + '\'] = value;';
            return new Function('value', body);
        }
        return function (obj, name, accessor) {
            var upperName = name.charAt(0).toUpperCase() + name.slice(1);
            var getter = 'get' + upperName;
            var setter = 'set' + upperName;
            if (!accessor) {
                obj[getter] = !accessor || typeof accessor.get !== 'function' ? simpleGetter(name) : accessor.get;
                obj[setter] = !accessor || typeof accessor.set !== 'function' ? simpleSetter(name) : accessor.set;
            } else {
                typeof accessor.get === 'function' && (obj[getter] = accessor.get);
                typeof accessor.set === 'function' && (obj[setter] = accessor.set);
            }
        };
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
});

void function (define) {
    define('eoo/main', [
        'require',
        './oo',
        './defineAccessor'
    ], function (require) {
        var oo = require('./oo');
        oo.defineAccessor = require('./defineAccessor');
        return oo;
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
});

define('eoo', ['eoo/main'], function ( main ) { return main; });

define('fc-core/oo', [
    'require',
    'underscore',
    './assert',
    'eoo'
], function (require) {
    'use strict';
    var _ = require('underscore');
    var assert = require('./assert');
    var oo = require('eoo');
    var exports = {};
    exports.create = function (overrides) {
        return oo.create(overrides);
    };
    exports.derive = function (superClass, overrides) {
        assert.has(superClass, 'fc.oo.derive\u4F7F\u7528\u65F6\u5FC5\u987B\u6307\u5B9A`superClass`\u53C2\u6570\uFF01');
        assert.equals(_.isObject(overrides) || overrides === undefined, true, '\u9519\u8BEF\u7684fc.oo.derive\u53C2\u6570\uFF0C\u4F20\u5165\u7684`overrides`\u5FC5\u987B\u662F\u4E00\u4E2AObject');
        return oo.create(superClass, overrides);
    };
    return exports;
});

void function (define) {
    define('promise/util', ['require'], function (require) {
        var util = {};
        var nativeBind = Function.prototype.bind;
        if (typeof nativeBind === 'function') {
            util.bind = function (fn) {
                return nativeBind.apply(fn, [].slice.call(arguments, 1));
            };
        } else {
            util.bind = function (fn, thisObject) {
                var extraArgs = [].slice.call(arguments, 2);
                return function () {
                    var args = extraArgs.concat([].slice.call(arguments));
                    return fn.apply(thisObject, args);
                };
            };
        }
        util.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };
        util.getThen = function (promise) {
            return promise && (typeof promise === 'object' || typeof promise === 'function') && promise.then;
        };
        return util;
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
}, this);

void function (define) {
    define('promise/setImmediate', [
        'require',
        './util'
    ], function (require) {
        var global = function () {
                return this;
            }();
        var callbackPool = {};
        var cursor = 1;
        function registerCallback(callback) {
            callbackPool[cursor] = callback;
            return cursor++;
        }
        function runCallback(tick) {
            var callback = callbackPool[tick];
            if (callback) {
                delete callbackPool[tick];
                callback();
            }
        }
        if (typeof global.setImmediate === 'function') {
            return require('./util').bind(global.setImmediate, global);
        }
        if (typeof global.nextTick === 'function') {
            return global.nextTick;
        }
        if (global.MutationObserver || global.webKitMutationObserver) {
            var ATTRIBUTE_NAME = 'data-promise-tick';
            var MutationObserver = global.MutationObserver || global.webKitMutationObserver;
            var ensureElementMutation = function (mutations, observer) {
                var item = mutations[0];
                if (item.attributeName === ATTRIBUTE_NAME) {
                    var tick = item.target.getAttribute(ATTRIBUTE_NAME);
                    runCallback(tick);
                    observer.disconnect(item.target);
                }
            };
            return function (callback) {
                var element = document.createElement('div');
                var observer = new MutationObserver(ensureElementMutation);
                observer.observe(element, { attributes: true });
                var tick = registerCallback(callback);
                element.setAttribute(ATTRIBUTE_NAME, tick);
            };
        }
        if (typeof postMessage === 'function' && typeof global.importScript !== 'function') {
            var isPostMessageAsync = true;
            var oldListener = global.onmessage;
            global.onmessage = function () {
                isPostMessageAsync = false;
            };
            global.postMessage('', '*');
            global.onmessage = oldListener;
            if (isPostMessageAsync) {
                var MESSAGE_PREFIX = 'promise-tick-';
                var ensureMessage = function (e) {
                    if (e.source === global && typeof e.data === 'string' && e.data.indexOf(MESSAGE_PREFIX) === 0) {
                        var tick = e.data.substring(MESSAGE_PREFIX.length);
                        runCallback(tick);
                    }
                };
                if (global.addEventListener) {
                    global.addEventListener('message', ensureMessage, false);
                } else {
                    global.attachEvent('onmessage', ensureMessage);
                }
                return function (callback) {
                    var tick = registerCallback(callback);
                    global.postMessage(MESSAGE_PREFIX + tick, '*');
                };
            }
        }
        if (global.MessageChannel) {
            var channel = new MessageChannel();
            channel.port1.onmessage = function (e) {
                var tick = e.data;
                runCallback(tick);
            };
            return function (callback) {
                var tick = registerCallback(callback);
                channel.port2.postMessage(tick);
            };
        }
        if ('onreadystatechange' in document.createElement('script')) {
            var documentElement = document.documentElement;
            return function (callback) {
                var script = document.createElement('script');
                script.onreadystatechange = function () {
                    callback();
                    script.onreadystatechange = null;
                    documentElement.removeChild(script);
                    script = null;
                };
                documentElement.appendChild(script);
            };
        }
        return function (callback) {
            setTimeout(callback, 0);
        };
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
}, this);

define('fc-core/setImmediate', [
    'require',
    'promise/setImmediate'
], function (require) {
    return require('promise/setImmediate');
});

(function (root) {
    function extend(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;
    }
    function Stack() {
        this.raw = [];
        this.length = 0;
    }
    Stack.prototype = {
        push: function (elem) {
            this.raw[this.length++] = elem;
        },
        pop: function () {
            if (this.length > 0) {
                var elem = this.raw[--this.length];
                this.raw.length = this.length;
                return elem;
            }
        },
        top: function () {
            return this.raw[this.length - 1];
        },
        bottom: function () {
            return this.raw[0];
        },
        find: function (condition) {
            var index = this.length;
            while (index--) {
                var item = this.raw[index];
                if (condition(item)) {
                    return item;
                }
            }
        }
    };
    var guidIndex = 178245;
    function generateGUID() {
        return '___' + guidIndex++;
    }
    function inherits(subClass, superClass) {
        var F = new Function();
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;
    }
    var HTML_ENTITY = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;'
        };
    function htmlFilterReplacer(c) {
        return HTML_ENTITY[c];
    }
    var DEFAULT_FILTERS = {
            html: function (source) {
                return source.replace(/[&<>"']/g, htmlFilterReplacer);
            },
            url: encodeURIComponent,
            raw: function (source) {
                return source;
            }
        };
    function stringLiteralize(source) {
        return '"' + source.replace(/\x5C/g, '\\\\').replace(/"/g, '\\"').replace(/\x0A/g, '\\n').replace(/\x09/g, '\\t').replace(/\x0D/g, '\\r') + '"';
    }
    function regexpLiteral(source) {
        return source.replace(/[\^\[\]\$\(\)\{\}\?\*\.\+]/g, function (c) {
            return '\\' + c;
        });
    }
    function stringFormat(source) {
        var args = arguments;
        return source.replace(/\{([0-9]+)\}/g, function (match, index) {
            return args[index - 0 + 1];
        });
    }
    var RENDER_STRING_DECLATION = 'var r="";';
    var RENDER_STRING_ADD_START = 'r+=';
    var RENDER_STRING_ADD_END = ';';
    var RENDER_STRING_RETURN = 'return r;';
    if (typeof navigator !== 'undefined' && /msie\s*([0-9]+)/i.test(navigator.userAgent) && RegExp.$1 - 0 < 8) {
        RENDER_STRING_DECLATION = 'var r=[],ri=0;';
        RENDER_STRING_ADD_START = 'r[ri++]=';
        RENDER_STRING_RETURN = 'return r.join("");';
    }
    function toGetVariableLiteral(name) {
        name = name.replace(/^\s*\*/, '');
        return stringFormat('gv({0},["{1}"])', stringLiteralize(name), name.replace(/\[['"]?([^'"]+)['"]?\]/g, function (match, name) {
            return '.' + name;
        }).split('.').join('","'));
    }
    function parseTextBlock(source, open, close, greedy, onInBlock, onOutBlock) {
        var closeLen = close.length;
        var texts = source.split(open);
        var level = 0;
        var buf = [];
        for (var i = 0, len = texts.length; i < len; i++) {
            var text = texts[i];
            if (i) {
                var openBegin = 1;
                level++;
                while (1) {
                    var closeIndex = text.indexOf(close);
                    if (closeIndex < 0) {
                        buf.push(level > 1 && openBegin ? open : '', text);
                        break;
                    }
                    level = greedy ? level - 1 : 0;
                    buf.push(level > 0 && openBegin ? open : '', text.slice(0, closeIndex), level > 0 ? close : '');
                    text = text.slice(closeIndex + closeLen);
                    openBegin = 0;
                    if (level === 0) {
                        break;
                    }
                }
                if (level === 0) {
                    onInBlock(buf.join(''));
                    onOutBlock(text);
                    buf = [];
                }
            } else {
                text && onOutBlock(text);
            }
        }
        if (level > 0 && buf.length > 0) {
            onOutBlock(open);
            onOutBlock(buf.join(''));
        }
    }
    function compileVariable(source, engine, forText) {
        var code = [];
        var options = engine.options;
        var toStringHead = '';
        var toStringFoot = '';
        var wrapHead = '';
        var wrapFoot = '';
        var defaultFilter;
        if (forText) {
            toStringHead = 'ts(';
            toStringFoot = ')';
            wrapHead = RENDER_STRING_ADD_START;
            wrapFoot = RENDER_STRING_ADD_END;
            defaultFilter = options.defaultFilter;
        }
        parseTextBlock(source, options.variableOpen, options.variableClose, 1, function (text) {
            if (forText && text.indexOf('|') < 0 && defaultFilter) {
                text += '|' + defaultFilter;
            }
            var filterCharIndex = text.indexOf('|');
            var variableName = (filterCharIndex > 0 ? text.slice(0, filterCharIndex) : text).replace(/^\s+/, '').replace(/\s+$/, '');
            var filterSource = filterCharIndex > 0 ? text.slice(filterCharIndex + 1) : '';
            var variableRawValue = variableName.indexOf('*') === 0;
            var variableCode = [
                    variableRawValue ? '' : toStringHead,
                    toGetVariableLiteral(variableName),
                    variableRawValue ? '' : toStringFoot
                ];
            if (filterSource) {
                filterSource = compileVariable(filterSource, engine);
                var filterSegs = filterSource.split('|');
                for (var i = 0, len = filterSegs.length; i < len; i++) {
                    var seg = filterSegs[i];
                    if (/^\s*([a-z0-9_-]+)(\((.*)\))?\s*$/i.test(seg)) {
                        variableCode.unshift('fs["' + RegExp.$1 + '"](');
                        if (RegExp.$3) {
                            variableCode.push(',', RegExp.$3);
                        }
                        variableCode.push(')');
                    }
                }
            }
            code.push(wrapHead, variableCode.join(''), wrapFoot);
        }, function (text) {
            code.push(wrapHead, forText ? stringLiteralize(text) : text, wrapFoot);
        });
        return code.join('');
    }
    function TextNode(value, engine) {
        this.value = value;
        this.engine = engine;
    }
    TextNode.prototype = {
        getRendererBody: function () {
            var value = this.value;
            var options = this.engine.options;
            if (!value || options.strip && /^\s*$/.test(value)) {
                return '';
            }
            return compileVariable(value, this.engine, 1);
        },
        clone: function () {
            return this;
        }
    };
    function Command(value, engine) {
        this.value = value;
        this.engine = engine;
        this.children = [];
        this.cloneProps = [];
    }
    Command.prototype = {
        addChild: function (node) {
            this.children.push(node);
        },
        open: function (context) {
            var parent = context.stack.top();
            parent && parent.addChild(this);
            context.stack.push(this);
        },
        close: function (context) {
            if (context.stack.top() === this) {
                context.stack.pop();
            }
        },
        getRendererBody: function () {
            var buf = [];
            var children = this.children;
            for (var i = 0; i < children.length; i++) {
                buf.push(children[i].getRendererBody());
            }
            return buf.join('');
        },
        clone: function () {
            var node = new this.constructor(this.value, this.engine);
            for (var i = 0, l = this.children.length; i < l; i++) {
                node.addChild(this.children[i].clone());
            }
            for (var i = 0, l = this.cloneProps.length; i < l; i++) {
                var prop = this.cloneProps[i];
                node[prop] = this[prop];
            }
            return node;
        }
    };
    function autoCloseCommand(context, CommandType) {
        var stack = context.stack;
        var closeEnd = CommandType ? stack.find(function (item) {
                return item instanceof CommandType;
            }) : stack.bottom();
        if (closeEnd) {
            var node;
            while ((node = stack.top()) !== closeEnd) {
                if (!node.autoClose) {
                    throw new Error(node.type + ' must be closed manually: ' + node.value);
                }
                node.autoClose(context);
            }
            closeEnd.close(context);
        }
        return closeEnd;
    }
    var RENDERER_BODY_START = '' + 'data=data||{};' + 'var v={},fs=engine.filters,hg=typeof data.get=="function",' + 'gv=function(n,ps){' + 'var p=ps[0],d=v[p];' + 'if(d==null){' + 'if(hg){return data.get(n);}' + 'd=data[p];' + '}' + 'for(var i=1,l=ps.length;i<l;i++)if(d!=null)d = d[ps[i]];' + 'return d;' + '},' + 'ts=function(s){' + 'if(typeof s==="string"){return s;}' + 'if(s==null){s="";}' + 'return ""+s;' + '};';
    ;
    function TargetCommand(value, engine) {
        if (!/^\s*([a-z0-9\/_-]+)\s*(\(\s*master\s*=\s*([a-z0-9\/_-]+)\s*\))?\s*/i.test(value)) {
            throw new Error('Invalid ' + this.type + ' syntax: ' + value);
        }
        this.master = RegExp.$3;
        this.name = RegExp.$1;
        Command.call(this, value, engine);
        this.blocks = {};
    }
    inherits(TargetCommand, Command);
    function BlockCommand(value, engine) {
        if (!/^\s*([a-z0-9\/_-]+)\s*$/i.test(value)) {
            throw new Error('Invalid ' + this.type + ' syntax: ' + value);
        }
        this.name = RegExp.$1;
        Command.call(this, value, engine);
        this.cloneProps = ['name'];
    }
    inherits(BlockCommand, Command);
    function ImportCommand(value, engine) {
        if (!/^\s*([a-z0-9\/_-]+)\s*$/i.test(value)) {
            throw new Error('Invalid ' + this.type + ' syntax: ' + value);
        }
        this.name = RegExp.$1;
        Command.call(this, value, engine);
        this.cloneProps = [
            'name',
            'state',
            'blocks'
        ];
        this.blocks = {};
    }
    inherits(ImportCommand, Command);
    function VarCommand(value, engine) {
        if (!/^\s*([a-z0-9_]+)\s*=([\s\S]*)$/i.test(value)) {
            throw new Error('Invalid ' + this.type + ' syntax: ' + value);
        }
        this.name = RegExp.$1;
        this.expr = RegExp.$2;
        Command.call(this, value, engine);
        this.cloneProps = [
            'name',
            'expr'
        ];
    }
    inherits(VarCommand, Command);
    function FilterCommand(value, engine) {
        if (!/^\s*([a-z0-9_-]+)\s*(\(([\s\S]*)\))?\s*$/i.test(value)) {
            throw new Error('Invalid ' + this.type + ' syntax: ' + value);
        }
        this.name = RegExp.$1;
        this.args = RegExp.$3;
        Command.call(this, value, engine);
        this.cloneProps = [
            'name',
            'args'
        ];
    }
    inherits(FilterCommand, Command);
    function UseCommand(value, engine) {
        if (!/^\s*([a-z0-9\/_-]+)\s*(\(([\s\S]*)\))?\s*$/i.test(value)) {
            throw new Error('Invalid ' + this.type + ' syntax: ' + value);
        }
        this.name = RegExp.$1;
        this.args = RegExp.$3;
        Command.call(this, value, engine);
        this.cloneProps = [
            'name',
            'args'
        ];
    }
    inherits(UseCommand, Command);
    function ForCommand(value, engine) {
        var rule = new RegExp(stringFormat('^\\s*({0}[\\s\\S]+{1})\\s+as\\s+{0}([0-9a-z_]+){1}\\s*(,\\s*{0}([0-9a-z_]+){1})?\\s*$', regexpLiteral(engine.options.variableOpen), regexpLiteral(engine.options.variableClose)), 'i');
        if (!rule.test(value)) {
            throw new Error('Invalid ' + this.type + ' syntax: ' + value);
        }
        this.list = RegExp.$1;
        this.item = RegExp.$2;
        this.index = RegExp.$4;
        Command.call(this, value, engine);
        this.cloneProps = [
            'list',
            'item',
            'index'
        ];
    }
    inherits(ForCommand, Command);
    function IfCommand(value, engine) {
        Command.call(this, value, engine);
    }
    inherits(IfCommand, Command);
    function ElifCommand(value, engine) {
        IfCommand.call(this, value, engine);
    }
    inherits(ElifCommand, IfCommand);
    function ElseCommand(value, engine) {
        Command.call(this, value, engine);
    }
    inherits(ElseCommand, IfCommand);
    var TargetState = {
            READING: 1,
            READED: 2,
            APPLIED: 3,
            READY: 4
        };
    ImportCommand.prototype.applyMaster = TargetCommand.prototype.applyMaster = function (masterName) {
        if (this.state >= TargetState.APPLIED) {
            return 1;
        }
        var blocks = this.blocks;
        function replaceBlock(node) {
            var children = node.children;
            if (children instanceof Array) {
                for (var i = 0, len = children.length; i < len; i++) {
                    var child = children[i];
                    if (child instanceof BlockCommand && blocks[child.name]) {
                        child = children[i] = blocks[child.name];
                    }
                    replaceBlock(child);
                }
            }
        }
        var master = this.engine.targets[masterName];
        if (master && master.applyMaster(master.master)) {
            this.children = master.clone().children;
            replaceBlock(this);
            this.state = TargetState.APPLIED;
            return 1;
        }
    };
    TargetCommand.prototype.isReady = function () {
        if (this.state >= TargetState.READY) {
            return 1;
        }
        var engine = this.engine;
        var readyState = 1;
        function checkReadyState(node) {
            for (var i = 0, len = node.children.length; i < len; i++) {
                var child = node.children[i];
                if (child instanceof ImportCommand) {
                    var target = engine.targets[child.name];
                    readyState = readyState && target && target.isReady(engine);
                } else if (child instanceof Command) {
                    checkReadyState(child);
                }
            }
        }
        if (this.applyMaster(this.master)) {
            checkReadyState(this);
            readyState && (this.state = TargetState.READY);
            return readyState;
        }
    };
    TargetCommand.prototype.getRenderer = function () {
        if (this.renderer) {
            return this.renderer;
        }
        if (this.isReady()) {
            var realRenderer = new Function('data', 'engine', [
                    RENDERER_BODY_START,
                    RENDER_STRING_DECLATION,
                    this.getRendererBody(),
                    RENDER_STRING_RETURN
                ].join('\n'));
            var engine = this.engine;
            this.renderer = function (data) {
                return realRenderer(data, engine);
            };
            return this.renderer;
        }
        return null;
    };
    function addTargetToContext(target, context) {
        context.target = target;
        var engine = context.engine;
        var name = target.name;
        if (engine.targets[name]) {
            switch (engine.options.namingConflict) {
            case 'override':
                engine.targets[name] = target;
                context.targets.push(name);
            case 'ignore':
                break;
            default:
                throw new Error('Target exists: ' + name);
            }
        } else {
            engine.targets[name] = target;
            context.targets.push(name);
        }
    }
    TargetCommand.prototype.open = function (context) {
        autoCloseCommand(context);
        Command.prototype.open.call(this, context);
        this.state = TargetState.READING;
        addTargetToContext(this, context);
    };
    VarCommand.prototype.open = UseCommand.prototype.open = function (context) {
        context.stack.top().addChild(this);
    };
    BlockCommand.prototype.open = function (context) {
        Command.prototype.open.call(this, context);
        (context.imp || context.target).blocks[this.name] = this;
    };
    ElifCommand.prototype.open = function (context) {
        var elseCommand = new ElseCommand();
        elseCommand.open(context);
        var ifCommand = autoCloseCommand(context, IfCommand);
        ifCommand.addChild(this);
        context.stack.push(this);
    };
    ElseCommand.prototype.open = function (context) {
        var ifCommand = autoCloseCommand(context, IfCommand);
        ifCommand.addChild(this);
        context.stack.push(this);
    };
    ImportCommand.prototype.open = function (context) {
        this.parent = context.stack.top();
        this.target = context.target;
        Command.prototype.open.call(this, context);
        this.state = TargetState.READING;
        context.imp = this;
    };
    UseCommand.prototype.close = VarCommand.prototype.close = function () {
    };
    ImportCommand.prototype.close = function (context) {
        Command.prototype.close.call(this, context);
        this.state = TargetState.READED;
        context.imp = null;
    };
    TargetCommand.prototype.close = function (context) {
        Command.prototype.close.call(this, context);
        this.state = this.master ? TargetState.READED : TargetState.APPLIED;
        context.target = null;
    };
    ImportCommand.prototype.autoClose = function (context) {
        var parentChildren = this.parent.children;
        parentChildren.push.apply(parentChildren, this.children);
        this.children.length = 0;
        for (var key in this.blocks) {
            this.target.blocks[key] = this.blocks[key];
        }
        this.blocks = {};
        this.close(context);
    };
    UseCommand.prototype.beforeOpen = ImportCommand.prototype.beforeOpen = VarCommand.prototype.beforeOpen = ForCommand.prototype.beforeOpen = FilterCommand.prototype.beforeOpen = BlockCommand.prototype.beforeOpen = IfCommand.prototype.beforeOpen = TextNode.prototype.beforeAdd = function (context) {
        if (context.stack.bottom()) {
            return;
        }
        var target = new TargetCommand(generateGUID(), context.engine);
        target.open(context);
    };
    ImportCommand.prototype.getRendererBody = function () {
        this.applyMaster(this.name);
        return Command.prototype.getRendererBody.call(this);
    };
    UseCommand.prototype.getRendererBody = function () {
        return stringFormat('{0}engine.render({2},{{3}}){1}', RENDER_STRING_ADD_START, RENDER_STRING_ADD_END, stringLiteralize(this.name), compileVariable(this.args, this.engine).replace(/(^|,)\s*([a-z0-9_]+)\s*=/gi, function (match, start, argName) {
            return (start || '') + stringLiteralize(argName) + ':';
        }));
    };
    VarCommand.prototype.getRendererBody = function () {
        if (this.expr) {
            return stringFormat('v[{0}]={1};', stringLiteralize(this.name), compileVariable(this.expr, this.engine));
        }
        return '';
    };
    IfCommand.prototype.getRendererBody = function () {
        return stringFormat('if({0}){{1}}', compileVariable(this.value, this.engine), Command.prototype.getRendererBody.call(this));
    };
    ElseCommand.prototype.getRendererBody = function () {
        return stringFormat('}else{{0}', Command.prototype.getRendererBody.call(this));
    };
    ForCommand.prototype.getRendererBody = function () {
        return stringFormat('' + 'var {0}={1};' + 'if({0} instanceof Array)' + 'for (var {4}=0,{5}={0}.length;{4}<{5};{4}++){v[{2}]={4};v[{3}]={0}[{4}];{6}}' + 'else if(typeof {0}==="object")' + 'for(var {4} in {0}){v[{2}]={4};v[{3}]={0}[{4}];{6}}', generateGUID(), compileVariable(this.list, this.engine), stringLiteralize(this.index || generateGUID()), stringLiteralize(this.item), generateGUID(), generateGUID(), Command.prototype.getRendererBody.call(this));
    };
    FilterCommand.prototype.getRendererBody = function () {
        var args = this.args;
        return stringFormat('{2}fs[{5}]((function(){{0}{4}{1}})(){6}){3}', RENDER_STRING_DECLATION, RENDER_STRING_RETURN, RENDER_STRING_ADD_START, RENDER_STRING_ADD_END, Command.prototype.getRendererBody.call(this), stringLiteralize(this.name), args ? ',' + compileVariable(args, this.engine) : '');
    };
    var commandTypes = {};
    function addCommandType(name, Type) {
        commandTypes[name] = Type;
        Type.prototype.type = name;
    }
    addCommandType('target', TargetCommand);
    addCommandType('block', BlockCommand);
    addCommandType('import', ImportCommand);
    addCommandType('use', UseCommand);
    addCommandType('var', VarCommand);
    addCommandType('for', ForCommand);
    addCommandType('if', IfCommand);
    addCommandType('elif', ElifCommand);
    addCommandType('else', ElseCommand);
    addCommandType('filter', FilterCommand);
    function Engine(options) {
        this.options = {
            commandOpen: '<!--',
            commandClose: '-->',
            commandSyntax: /^\s*(\/)?([a-z]+)\s*(?::([\s\S]*))?$/,
            variableOpen: '${',
            variableClose: '}',
            defaultFilter: 'html'
        };
        this.config(options);
        this.targets = {};
        this.filters = extend({}, DEFAULT_FILTERS);
    }
    Engine.prototype.config = function (options) {
        extend(this.options, options);
    };
    Engine.prototype.compile = Engine.prototype.parse = function (source) {
        if (source) {
            var targetNames = parseSource(source, this);
            if (targetNames.length) {
                return this.targets[targetNames[0]].getRenderer();
            }
        }
        return new Function('return ""');
    };
    Engine.prototype.getRenderer = function (name) {
        var target = this.targets[name];
        if (target) {
            return target.getRenderer();
        }
    };
    Engine.prototype.render = function (name, data) {
        var renderer = this.getRenderer(name);
        if (renderer) {
            return renderer(data);
        }
        return '';
    };
    Engine.prototype.addFilter = function (name, filter) {
        if (typeof filter === 'function') {
            this.filters[name] = filter;
        }
    };
    function parseSource(source, engine) {
        var commandOpen = engine.options.commandOpen;
        var commandClose = engine.options.commandClose;
        var commandSyntax = engine.options.commandSyntax;
        var stack = new Stack();
        var analyseContext = {
                engine: engine,
                targets: [],
                stack: stack,
                target: null
            };
        var textBuf = [];
        function flushTextBuf() {
            var text;
            if (textBuf.length > 0 && (text = textBuf.join(''))) {
                var textNode = new TextNode(text, engine);
                textNode.beforeAdd(analyseContext);
                stack.top().addChild(textNode);
                textBuf = [];
                if (engine.options.strip && analyseContext.current instanceof Command) {
                    textNode.value = text.replace(/^[\x20\t\r]*\n/, '');
                }
                analyseContext.current = textNode;
            }
        }
        var NodeType;
        parseTextBlock(source, commandOpen, commandClose, 0, function (text) {
            var match = commandSyntax.exec(text);
            if (match && (NodeType = commandTypes[match[2].toLowerCase()]) && typeof NodeType === 'function') {
                flushTextBuf();
                var currentNode = analyseContext.current;
                if (engine.options.strip && currentNode instanceof TextNode) {
                    currentNode.value = currentNode.value.replace(/\r?\n[\x20\t]*$/, '\n');
                }
                if (match[1]) {
                    currentNode = autoCloseCommand(analyseContext, NodeType);
                } else {
                    currentNode = new NodeType(match[3], engine);
                    if (typeof currentNode.beforeOpen === 'function') {
                        currentNode.beforeOpen(analyseContext);
                    }
                    currentNode.open(analyseContext);
                }
                analyseContext.current = currentNode;
            } else if (!/^\s*\/\//.test(text)) {
                textBuf.push(commandOpen, text, commandClose);
            }
            NodeType = null;
        }, function (text) {
            textBuf.push(text);
        });
        flushTextBuf();
        autoCloseCommand(analyseContext);
        return analyseContext.targets;
    }
    var etpl = new Engine();
    etpl.Engine = Engine;
    if (typeof exports === 'object' && typeof module === 'object') {
        exports = module.exports = etpl;
    } else if (typeof define === 'function' && define.amd) {
        define('etpl/main', [], etpl);
    } else {
        root.etpl = etpl;
    }
}(this));

define('etpl', ['etpl/main'], function ( main ) { return main; });

define('mini-event/lib', ['require'], function (require) {
    var lib = {};
    lib.extend = function (source) {
        for (var i = 1; i < arguments.length; i++) {
            var addition = arguments[i];
            if (!addition) {
                continue;
            }
            for (var key in addition) {
                if (addition.hasOwnProperty(key)) {
                    source[key] = addition[key];
                }
            }
        }
        return source;
    };
    return lib;
});

define('mini-event/Event', [
    'require',
    './lib'
], function (require) {
    var lib = require('./lib');
    function returnTrue() {
        return true;
    }
    function returnFalse() {
        return false;
    }
    function isObject(target) {
        return Object.prototype.toString.call(target) === '[object Object]';
    }
    function Event(type, args) {
        if (typeof type === 'object') {
            args = type;
            type = args.type;
        }
        if (isObject(args)) {
            lib.extend(this, args);
        } else if (args) {
            this.data = args;
        }
        if (type) {
            this.type = type;
        }
    }
    Event.prototype.isDefaultPrevented = returnFalse;
    Event.prototype.preventDefault = function () {
        this.isDefaultPrevented = returnTrue;
    };
    Event.prototype.isPropagationStopped = returnFalse;
    Event.prototype.stopPropagation = function () {
        this.isPropagationStopped = returnTrue;
    };
    Event.prototype.isImmediatePropagationStopped = returnFalse;
    Event.prototype.stopImmediatePropagation = function () {
        this.isImmediatePropagationStopped = returnTrue;
        this.stopPropagation();
    };
    var globalWindow = function () {
            return this;
        }();
    Event.fromDOMEvent = function (domEvent, type, args) {
        domEvent = domEvent || globalWindow.event;
        var event = new Event(type, args);
        event.preventDefault = function () {
            if (domEvent.preventDefault) {
                domEvent.preventDefault();
            } else {
                domEvent.returnValue = false;
            }
            Event.prototype.preventDefault.call(this);
        };
        event.stopPropagation = function () {
            if (domEvent.stopPropagation) {
                domEvent.stopPropagation();
            } else {
                domEvent.cancelBubble = true;
            }
            Event.prototype.stopPropagation.call(this);
        };
        event.stopImmediatePropagation = function () {
            if (domEvent.stopImmediatePropagation) {
                domEvent.stopImmediatePropagation();
            }
            Event.prototype.stopImmediatePropagation.call(this);
        };
        return event;
    };
    var EVENT_PROPERTY_BLACK_LIST = {
            type: true,
            target: true,
            preventDefault: true,
            isDefaultPrevented: true,
            stopPropagation: true,
            isPropagationStopped: true,
            stopImmediatePropagation: true,
            isImmediatePropagationStopped: true
        };
    Event.fromEvent = function (originalEvent, options) {
        var defaults = {
                type: originalEvent.type,
                preserveData: false,
                syncState: false
            };
        options = lib.extend(defaults, options);
        var newEvent = new Event(options.type);
        if (options.preserveData) {
            for (var key in originalEvent) {
                if (originalEvent.hasOwnProperty(key) && !EVENT_PROPERTY_BLACK_LIST.hasOwnProperty(key)) {
                    newEvent[key] = originalEvent[key];
                }
            }
        }
        if (options.extend) {
            lib.extend(newEvent, options.extend);
        }
        if (options.syncState) {
            newEvent.preventDefault = function () {
                originalEvent.preventDefault();
                Event.prototype.preventDefault.call(this);
            };
            newEvent.stopPropagation = function () {
                originalEvent.stopPropagation();
                Event.prototype.stopPropagation.call(this);
            };
            newEvent.stopImmediatePropagation = function () {
                originalEvent.stopImmediatePropagation();
                Event.prototype.stopImmediatePropagation.call(this);
            };
        }
        return newEvent;
    };
    Event.delegate = function (from, fromType, to, toType, options) {
        var useDifferentType = typeof fromType === 'string';
        var source = {
                object: from,
                type: useDifferentType ? fromType : to
            };
        var target = {
                object: useDifferentType ? to : fromType,
                type: useDifferentType ? toType : to
            };
        var config = useDifferentType ? options : toType;
        config = lib.extend({ preserveData: false }, config);
        if (typeof source.object.on !== 'function' || typeof target.object.on !== 'function' || typeof target.object.fire !== 'function') {
            return;
        }
        var delegator = function (originalEvent) {
            var event = Event.fromEvent(originalEvent, config);
            event.type = target.type;
            event.target = target.object;
            target.object.fire(target.type, event);
        };
        source.object.on(source.type, delegator);
    };
    return Event;
});

define('fc-core/util', [
    'require',
    'underscore',
    'mini-event/Event',
    'etpl'
], function (require) {
    'use strict';
    var _ = require('underscore');
    var util = {};
    function rand16Num(len) {
        len = len || 0;
        var result = [];
        for (var i = 0; i < len; i++) {
            result.push('0123456789abcdef'.charAt(Math.floor(Math.random() * 16)));
        }
        return result.join('');
    }
    util.guid = function () {
        var curr = new Date().valueOf().toString();
        return [
            '4b534c46',
            rand16Num(4),
            '4' + rand16Num(3),
            rand16Num(4),
            curr.substring(0, 12)
        ].join('-');
    };
    util.uid = function () {
        return [
            new Date().valueOf().toString(),
            rand16Num(4)
        ].join('');
    };
    var search = window.location.search.substring(1);
    util.processError = window.DEBUG || /\bdebug\b/g.test(search) ? function (ex) {
        if (ex instanceof Error) {
            window.console.error(ex.stack);
        } else if (ex.error instanceof Error || _.isArray(ex.error)) {
            util.processError(ex.error);
        } else if (_.isArray(ex)) {
            _.each(ex, util.processError);
        } else if (ex instanceof require('mini-event/Event') && ex.type === 'error') {
            window.console.error(ex.error.failType, ex.error.reason, ex);
        } else {
            window.console.error(ex);
        }
    } : _.noop;
    function mixWith(conf, data) {
        return JSON.parse(require('etpl').compile(JSON.stringify(conf))(data));
    }
    util.mixWith = mixWith;
    util.customData = function (data) {
        return { data: data };
    };
    return util;
});

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

define('fc-core/main', [
    'require',
    './aop',
    './assert',
    './oo',
    './setImmediate',
    'etpl',
    './util',
    './extension/underscore'
], function (require) {
    'use strict';
    var fc = {
            version: '0.0.1.alpha.7',
            aop: require('./aop'),
            assert: require('./assert'),
            oo: require('./oo'),
            setImmediate: require('./setImmediate'),
            tpl: require('etpl'),
            util: require('./util')
        };
    fc.tpl.config({ namingConflict: 'ignore' });
    require('./extension/underscore').activate();
    return fc;
});

define('fc-core', ['fc-core/main'], function ( main ) { return main; });

define('k-component/lib/zepto', ['require'], function (require) {
    var Zepto = function () {
            var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice, document = window.document, elementDisplay = {}, classCache = {}, cssNumber = {
                    'column-count': 1,
                    'columns': 1,
                    'font-weight': 1,
                    'line-height': 1,
                    'opacity': 1,
                    'z-index': 1,
                    'zoom': 1
                }, fragmentRE = /^\s*<(\w+|!)[^>]*>/, singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rootNodeRE = /^(?:body|html)$/i, capitalRE = /([A-Z])/g, methodAttributes = [
                    'val',
                    'css',
                    'html',
                    'text',
                    'data',
                    'width',
                    'height',
                    'offset'
                ], adjacencyOperators = [
                    'after',
                    'prepend',
                    'before',
                    'append'
                ], table = document.createElement('table'), tableRow = document.createElement('tr'), containers = {
                    'tr': document.createElement('tbody'),
                    'tbody': table,
                    'thead': table,
                    'tfoot': table,
                    'td': tableRow,
                    'th': tableRow,
                    '*': document.createElement('div')
                }, readyRE = /complete|loaded|interactive/, simpleSelectorRE = /^[\w-]*$/, class2type = {}, toString = class2type.toString, zepto = {}, camelize, uniq, tempParent = document.createElement('div'), propMap = {
                    'tabindex': 'tabIndex',
                    'readonly': 'readOnly',
                    'for': 'htmlFor',
                    'class': 'className',
                    'maxlength': 'maxLength',
                    'cellspacing': 'cellSpacing',
                    'cellpadding': 'cellPadding',
                    'rowspan': 'rowSpan',
                    'colspan': 'colSpan',
                    'usemap': 'useMap',
                    'frameborder': 'frameBorder',
                    'contenteditable': 'contentEditable'
                }, isArray = Array.isArray || function (object) {
                    return object instanceof Array;
                };
            zepto.matches = function (element, selector) {
                if (!selector || !element || element.nodeType !== 1)
                    return false;
                var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
                if (matchesSelector)
                    return matchesSelector.call(element, selector);
                var match, parent = element.parentNode, temp = !parent;
                if (temp)
                    (parent = tempParent).appendChild(element);
                match = ~zepto.qsa(parent, selector).indexOf(element);
                temp && tempParent.removeChild(element);
                return match;
            };
            function type(obj) {
                return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
            }
            function isFunction(value) {
                return type(value) == 'function';
            }
            function isWindow(obj) {
                return obj != null && obj == obj.window;
            }
            function isDocument(obj) {
                return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
            }
            function isObject(obj) {
                return type(obj) == 'object';
            }
            function isPlainObject(obj) {
                return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
            }
            function likeArray(obj) {
                return typeof obj.length == 'number';
            }
            function compact(array) {
                return filter.call(array, function (item) {
                    return item != null;
                });
            }
            function flatten(array) {
                return array.length > 0 ? $.fn.concat.apply([], array) : array;
            }
            camelize = function (str) {
                return str.replace(/-+(.)?/g, function (match, chr) {
                    return chr ? chr.toUpperCase() : '';
                });
            };
            function dasherize(str) {
                return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/_/g, '-').toLowerCase();
            }
            uniq = function (array) {
                return filter.call(array, function (item, idx) {
                    return array.indexOf(item) == idx;
                });
            };
            function classRE(name) {
                return name in classCache ? classCache[name] : classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)');
            }
            function maybeAddPx(name, value) {
                return typeof value == 'number' && !cssNumber[dasherize(name)] ? value + 'px' : value;
            }
            function defaultDisplay(nodeName) {
                var element, display;
                if (!elementDisplay[nodeName]) {
                    element = document.createElement(nodeName);
                    document.body.appendChild(element);
                    display = getComputedStyle(element, '').getPropertyValue('display');
                    element.parentNode.removeChild(element);
                    display == 'none' && (display = 'block');
                    elementDisplay[nodeName] = display;
                }
                return elementDisplay[nodeName];
            }
            function children(element) {
                return 'children' in element ? slice.call(element.children) : $.map(element.childNodes, function (node) {
                    if (node.nodeType == 1)
                        return node;
                });
            }
            function Z(dom, selector) {
                var i, len = dom ? dom.length : 0;
                for (i = 0; i < len; i++)
                    this[i] = dom[i];
                this.length = len;
                this.selector = selector || '';
            }
            zepto.fragment = function (html, name, properties) {
                var dom, nodes, container;
                if (singleTagRE.test(html))
                    dom = $(document.createElement(RegExp.$1));
                if (!dom) {
                    if (html.replace)
                        html = html.replace(tagExpanderRE, '<$1></$2>');
                    if (name === undefined)
                        name = fragmentRE.test(html) && RegExp.$1;
                    if (!(name in containers))
                        name = '*';
                    container = containers[name];
                    container.innerHTML = '' + html;
                    dom = $.each(slice.call(container.childNodes), function () {
                        container.removeChild(this);
                    });
                }
                if (isPlainObject(properties)) {
                    nodes = $(dom);
                    $.each(properties, function (key, value) {
                        if (methodAttributes.indexOf(key) > -1)
                            nodes[key](value);
                        else
                            nodes.attr(key, value);
                    });
                }
                return dom;
            };
            zepto.Z = function (dom, selector) {
                return new Z(dom, selector);
            };
            zepto.isZ = function (object) {
                return object instanceof zepto.Z;
            };
            zepto.init = function (selector, context) {
                var dom;
                if (!selector)
                    return zepto.Z();
                else if (typeof selector == 'string') {
                    selector = selector.trim();
                    if (selector[0] == '<' && fragmentRE.test(selector))
                        dom = zepto.fragment(selector, RegExp.$1, context), selector = null;
                    else if (context !== undefined)
                        return $(context).find(selector);
                    else
                        dom = zepto.qsa(document, selector);
                } else if (isFunction(selector))
                    return $(document).ready(selector);
                else if (zepto.isZ(selector))
                    return selector;
                else {
                    if (isArray(selector))
                        dom = compact(selector);
                    else if (isObject(selector))
                        dom = [selector], selector = null;
                    else if (fragmentRE.test(selector))
                        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
                    else if (context !== undefined)
                        return $(context).find(selector);
                    else
                        dom = zepto.qsa(document, selector);
                }
                return zepto.Z(dom, selector);
            };
            $ = function (selector, context) {
                return zepto.init(selector, context);
            };
            function extend(target, source, deep) {
                for (key in source)
                    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                            target[key] = {};
                        if (isArray(source[key]) && !isArray(target[key]))
                            target[key] = [];
                        extend(target[key], source[key], deep);
                    } else if (source[key] !== undefined)
                        target[key] = source[key];
            }
            $.extend = function (target) {
                var deep, args = slice.call(arguments, 1);
                if (typeof target == 'boolean') {
                    deep = target;
                    target = args.shift();
                }
                args.forEach(function (arg) {
                    extend(target, arg, deep);
                });
                return target;
            };
            zepto.qsa = function (element, selector) {
                var found, maybeID = selector[0] == '#', maybeClass = !maybeID && selector[0] == '.', nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, isSimple = simpleSelectorRE.test(nameOnly);
                return element.getElementById && isSimple && maybeID ? (found = element.getElementById(nameOnly)) ? [found] : [] : element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11 ? [] : slice.call(isSimple && !maybeID && element.getElementsByClassName ? maybeClass ? element.getElementsByClassName(nameOnly) : element.getElementsByTagName(selector) : element.querySelectorAll(selector));
            };
            function filtered(nodes, selector) {
                return selector == null ? $(nodes) : $(nodes).filter(selector);
            }
            $.contains = document.documentElement.contains ? function (parent, node) {
                return parent !== node && parent.contains(node);
            } : function (parent, node) {
                while (node && (node = node.parentNode))
                    if (node === parent)
                        return true;
                return false;
            };
            function funcArg(context, arg, idx, payload) {
                return isFunction(arg) ? arg.call(context, idx, payload) : arg;
            }
            function setAttribute(node, name, value) {
                value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
            }
            function className(node, value) {
                var klass = node.className || '', svg = klass && klass.baseVal !== undefined;
                if (value === undefined)
                    return svg ? klass.baseVal : klass;
                svg ? klass.baseVal = value : node.className = value;
            }
            function deserializeValue(value) {
                try {
                    return value ? value == 'true' || (value == 'false' ? false : value == 'null' ? null : +value + '' == value ? +value : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
                } catch (e) {
                    return value;
                }
            }
            $.type = type;
            $.isFunction = isFunction;
            $.isWindow = isWindow;
            $.isArray = isArray;
            $.isPlainObject = isPlainObject;
            $.isEmptyObject = function (obj) {
                var name;
                for (name in obj)
                    return false;
                return true;
            };
            $.inArray = function (elem, array, i) {
                return emptyArray.indexOf.call(array, elem, i);
            };
            $.camelCase = camelize;
            $.trim = function (str) {
                return str == null ? '' : String.prototype.trim.call(str);
            };
            $.uuid = 0;
            $.support = {};
            $.expr = {};
            $.noop = function () {
            };
            $.map = function (elements, callback) {
                var value, values = [], i, key;
                if (likeArray(elements))
                    for (i = 0; i < elements.length; i++) {
                        value = callback(elements[i], i);
                        if (value != null)
                            values.push(value);
                    }
                else
                    for (key in elements) {
                        value = callback(elements[key], key);
                        if (value != null)
                            values.push(value);
                    }
                return flatten(values);
            };
            $.each = function (elements, callback) {
                var i, key;
                if (likeArray(elements)) {
                    for (i = 0; i < elements.length; i++)
                        if (callback.call(elements[i], i, elements[i]) === false)
                            return elements;
                } else {
                    for (key in elements)
                        if (callback.call(elements[key], key, elements[key]) === false)
                            return elements;
                }
                return elements;
            };
            $.grep = function (elements, callback) {
                return filter.call(elements, callback);
            };
            if (window.JSON)
                $.parseJSON = JSON.parse;
            $.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function (i, name) {
                class2type['[object ' + name + ']'] = name.toLowerCase();
            });
            $.fn = {
                constructor: zepto.Z,
                length: 0,
                forEach: emptyArray.forEach,
                reduce: emptyArray.reduce,
                push: emptyArray.push,
                sort: emptyArray.sort,
                splice: emptyArray.splice,
                indexOf: emptyArray.indexOf,
                concat: function () {
                    var i, value, args = [];
                    for (i = 0; i < arguments.length; i++) {
                        value = arguments[i];
                        args[i] = zepto.isZ(value) ? value.toArray() : value;
                    }
                    return concat.apply(zepto.isZ(this) ? this.toArray() : this, args);
                },
                map: function (fn) {
                    return $($.map(this, function (el, i) {
                        return fn.call(el, i, el);
                    }));
                },
                slice: function () {
                    return $(slice.apply(this, arguments));
                },
                ready: function (callback) {
                    if (readyRE.test(document.readyState) && document.body)
                        callback($);
                    else
                        document.addEventListener('DOMContentLoaded', function () {
                            callback($);
                        }, false);
                    return this;
                },
                get: function (idx) {
                    return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
                },
                toArray: function () {
                    return this.get();
                },
                size: function () {
                    return this.length;
                },
                remove: function () {
                    return this.each(function () {
                        if (this.parentNode != null)
                            this.parentNode.removeChild(this);
                    });
                },
                each: function (callback) {
                    emptyArray.every.call(this, function (el, idx) {
                        return callback.call(el, idx, el) !== false;
                    });
                    return this;
                },
                filter: function (selector) {
                    if (isFunction(selector))
                        return this.not(this.not(selector));
                    return $(filter.call(this, function (element) {
                        return zepto.matches(element, selector);
                    }));
                },
                add: function (selector, context) {
                    return $(uniq(this.concat($(selector, context))));
                },
                is: function (selector) {
                    return this.length > 0 && zepto.matches(this[0], selector);
                },
                not: function (selector) {
                    var nodes = [];
                    if (isFunction(selector) && selector.call !== undefined)
                        this.each(function (idx) {
                            if (!selector.call(this, idx))
                                nodes.push(this);
                        });
                    else {
                        var excludes = typeof selector == 'string' ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
                        this.forEach(function (el) {
                            if (excludes.indexOf(el) < 0)
                                nodes.push(el);
                        });
                    }
                    return $(nodes);
                },
                has: function (selector) {
                    return this.filter(function () {
                        return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
                    });
                },
                eq: function (idx) {
                    return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
                },
                first: function () {
                    var el = this[0];
                    return el && !isObject(el) ? el : $(el);
                },
                last: function () {
                    var el = this[this.length - 1];
                    return el && !isObject(el) ? el : $(el);
                },
                find: function (selector) {
                    var result, $this = this;
                    if (!selector)
                        result = $();
                    else if (typeof selector == 'object')
                        result = $(selector).filter(function () {
                            var node = this;
                            return emptyArray.some.call($this, function (parent) {
                                return $.contains(parent, node);
                            });
                        });
                    else if (this.length == 1)
                        result = $(zepto.qsa(this[0], selector));
                    else
                        result = this.map(function () {
                            return zepto.qsa(this, selector);
                        });
                    return result;
                },
                closest: function (selector, context) {
                    var node = this[0], collection = false;
                    if (typeof selector == 'object')
                        collection = $(selector);
                    while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
                        node = node !== context && !isDocument(node) && node.parentNode;
                    return $(node);
                },
                parents: function (selector) {
                    var ancestors = [], nodes = this;
                    while (nodes.length > 0)
                        nodes = $.map(nodes, function (node) {
                            if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                                ancestors.push(node);
                                return node;
                            }
                        });
                    return filtered(ancestors, selector);
                },
                parent: function (selector) {
                    return filtered(uniq(this.pluck('parentNode')), selector);
                },
                children: function (selector) {
                    return filtered(this.map(function () {
                        return children(this);
                    }), selector);
                },
                contents: function () {
                    return this.map(function () {
                        return this.contentDocument || slice.call(this.childNodes);
                    });
                },
                siblings: function (selector) {
                    return filtered(this.map(function (i, el) {
                        return filter.call(children(el.parentNode), function (child) {
                            return child !== el;
                        });
                    }), selector);
                },
                empty: function () {
                    return this.each(function () {
                        this.innerHTML = '';
                    });
                },
                pluck: function (property) {
                    return $.map(this, function (el) {
                        return el[property];
                    });
                },
                show: function () {
                    return this.each(function () {
                        this.style.display == 'none' && (this.style.display = '');
                        if (getComputedStyle(this, '').getPropertyValue('display') == 'none')
                            this.style.display = defaultDisplay(this.nodeName);
                    });
                },
                replaceWith: function (newContent) {
                    return this.before(newContent).remove();
                },
                wrap: function (structure) {
                    var func = isFunction(structure);
                    if (this[0] && !func)
                        var dom = $(structure).get(0), clone = dom.parentNode || this.length > 1;
                    return this.each(function (index) {
                        $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom);
                    });
                },
                wrapAll: function (structure) {
                    if (this[0]) {
                        $(this[0]).before(structure = $(structure));
                        var children;
                        while ((children = structure.children()).length)
                            structure = children.first();
                        $(structure).append(this);
                    }
                    return this;
                },
                wrapInner: function (structure) {
                    var func = isFunction(structure);
                    return this.each(function (index) {
                        var self = $(this), contents = self.contents(), dom = func ? structure.call(this, index) : structure;
                        contents.length ? contents.wrapAll(dom) : self.append(dom);
                    });
                },
                unwrap: function () {
                    this.parent().each(function () {
                        $(this).replaceWith($(this).children());
                    });
                    return this;
                },
                clone: function () {
                    return this.map(function () {
                        return this.cloneNode(true);
                    });
                },
                hide: function () {
                    return this.css('display', 'none');
                },
                toggle: function (setting) {
                    return this.each(function () {
                        var el = $(this);
                        ;
                        (setting === undefined ? el.css('display') == 'none' : setting) ? el.show() : el.hide();
                    });
                },
                prev: function (selector) {
                    return $(this.pluck('previousElementSibling')).filter(selector || '*');
                },
                next: function (selector) {
                    return $(this.pluck('nextElementSibling')).filter(selector || '*');
                },
                html: function (html) {
                    return 0 in arguments ? this.each(function (idx) {
                        var originHtml = this.innerHTML;
                        $(this).empty().append(funcArg(this, html, idx, originHtml));
                    }) : 0 in this ? this[0].innerHTML : null;
                },
                text: function (text) {
                    return 0 in arguments ? this.each(function (idx) {
                        var newText = funcArg(this, text, idx, this.textContent);
                        this.textContent = newText == null ? '' : '' + newText;
                    }) : 0 in this ? this[0].textContent : null;
                },
                attr: function (name, value) {
                    var result;
                    return typeof name == 'string' && !(1 in arguments) ? !this.length || this[0].nodeType !== 1 ? undefined : !(result = this[0].getAttribute(name)) && name in this[0] ? this[0][name] : result : this.each(function (idx) {
                        if (this.nodeType !== 1)
                            return;
                        if (isObject(name))
                            for (key in name)
                                setAttribute(this, key, name[key]);
                        else
                            setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
                    });
                },
                removeAttr: function (name) {
                    return this.each(function () {
                        this.nodeType === 1 && name.split(' ').forEach(function (attribute) {
                            setAttribute(this, attribute);
                        }, this);
                    });
                },
                prop: function (name, value) {
                    name = propMap[name] || name;
                    return 1 in arguments ? this.each(function (idx) {
                        this[name] = funcArg(this, value, idx, this[name]);
                    }) : this[0] && this[0][name];
                },
                data: function (name, value) {
                    var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase();
                    var data = 1 in arguments ? this.attr(attrName, value) : this.attr(attrName);
                    return data !== null ? deserializeValue(data) : undefined;
                },
                val: function (value) {
                    return 0 in arguments ? this.each(function (idx) {
                        this.value = funcArg(this, value, idx, this.value);
                    }) : this[0] && (this[0].multiple ? $(this[0]).find('option').filter(function () {
                        return this.selected;
                    }).pluck('value') : this[0].value);
                },
                offset: function (coordinates) {
                    if (coordinates)
                        return this.each(function (index) {
                            var $this = $(this), coords = funcArg(this, coordinates, index, $this.offset()), parentOffset = $this.offsetParent().offset(), props = {
                                    top: coords.top - parentOffset.top,
                                    left: coords.left - parentOffset.left
                                };
                            if ($this.css('position') == 'static')
                                props['position'] = 'relative';
                            $this.css(props);
                        });
                    if (!this.length)
                        return null;
                    if (!$.contains(document.documentElement, this[0]))
                        return {
                            top: 0,
                            left: 0
                        };
                    var obj = this[0].getBoundingClientRect();
                    return {
                        left: obj.left + window.pageXOffset,
                        top: obj.top + window.pageYOffset,
                        width: Math.round(obj.width),
                        height: Math.round(obj.height)
                    };
                },
                css: function (property, value) {
                    if (arguments.length < 2) {
                        var computedStyle, element = this[0];
                        if (!element)
                            return;
                        computedStyle = getComputedStyle(element, '');
                        if (typeof property == 'string')
                            return element.style[camelize(property)] || computedStyle.getPropertyValue(property);
                        else if (isArray(property)) {
                            var props = {};
                            $.each(property, function (_, prop) {
                                props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop);
                            });
                            return props;
                        }
                    }
                    var css = '';
                    if (type(property) == 'string') {
                        if (!value && value !== 0)
                            this.each(function () {
                                this.style.removeProperty(dasherize(property));
                            });
                        else
                            css = dasherize(property) + ':' + maybeAddPx(property, value);
                    } else {
                        for (key in property)
                            if (!property[key] && property[key] !== 0)
                                this.each(function () {
                                    this.style.removeProperty(dasherize(key));
                                });
                            else
                                css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
                    }
                    return this.each(function () {
                        this.style.cssText += ';' + css;
                    });
                },
                index: function (element) {
                    return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
                },
                hasClass: function (name) {
                    if (!name)
                        return false;
                    return emptyArray.some.call(this, function (el) {
                        return this.test(className(el));
                    }, classRE(name));
                },
                addClass: function (name) {
                    if (!name)
                        return this;
                    return this.each(function (idx) {
                        if (!('className' in this))
                            return;
                        classList = [];
                        var cls = className(this), newName = funcArg(this, name, idx, cls);
                        newName.split(/\s+/g).forEach(function (klass) {
                            if (!$(this).hasClass(klass))
                                classList.push(klass);
                        }, this);
                        classList.length && className(this, cls + (cls ? ' ' : '') + classList.join(' '));
                    });
                },
                removeClass: function (name) {
                    return this.each(function (idx) {
                        if (!('className' in this))
                            return;
                        if (name === undefined)
                            return className(this, '');
                        classList = className(this);
                        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
                            classList = classList.replace(classRE(klass), ' ');
                        });
                        className(this, classList.trim());
                    });
                },
                toggleClass: function (name, when) {
                    if (!name)
                        return this;
                    return this.each(function (idx) {
                        var $this = $(this), names = funcArg(this, name, idx, className(this));
                        names.split(/\s+/g).forEach(function (klass) {
                            (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
                        });
                    });
                },
                scrollTop: function (value) {
                    if (!this.length)
                        return;
                    var hasScrollTop = 'scrollTop' in this[0];
                    if (value === undefined)
                        return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
                    return this.each(hasScrollTop ? function () {
                        this.scrollTop = value;
                    } : function () {
                        this.scrollTo(this.scrollX, value);
                    });
                },
                scrollLeft: function (value) {
                    if (!this.length)
                        return;
                    var hasScrollLeft = 'scrollLeft' in this[0];
                    if (value === undefined)
                        return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
                    return this.each(hasScrollLeft ? function () {
                        this.scrollLeft = value;
                    } : function () {
                        this.scrollTo(value, this.scrollY);
                    });
                },
                position: function () {
                    if (!this.length)
                        return;
                    var elem = this[0], offsetParent = this.offsetParent(), offset = this.offset(), parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
                            top: 0,
                            left: 0
                        } : offsetParent.offset();
                    offset.top -= parseFloat($(elem).css('margin-top')) || 0;
                    offset.left -= parseFloat($(elem).css('margin-left')) || 0;
                    parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0;
                    parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0;
                    return {
                        top: offset.top - parentOffset.top,
                        left: offset.left - parentOffset.left
                    };
                },
                offsetParent: function () {
                    return this.map(function () {
                        var parent = this.offsetParent || document.body;
                        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css('position') == 'static')
                            parent = parent.offsetParent;
                        return parent;
                    });
                }
            };
            $.fn.detach = $.fn.remove;
            ;
            [
                'width',
                'height'
            ].forEach(function (dimension) {
                var dimensionProperty = dimension.replace(/./, function (m) {
                        return m[0].toUpperCase();
                    });
                $.fn[dimension] = function (value) {
                    var offset, el = this[0];
                    if (value === undefined)
                        return isWindow(el) ? el['inner' + dimensionProperty] : isDocument(el) ? el.documentElement['scroll' + dimensionProperty] : (offset = this.offset()) && offset[dimension];
                    else
                        return this.each(function (idx) {
                            el = $(this);
                            el.css(dimension, funcArg(this, value, idx, el[dimension]()));
                        });
                };
            });
            function traverseNode(node, fun) {
                fun(node);
                for (var i = 0, len = node.childNodes.length; i < len; i++)
                    traverseNode(node.childNodes[i], fun);
            }
            adjacencyOperators.forEach(function (operator, operatorIndex) {
                var inside = operatorIndex % 2;
                $.fn[operator] = function () {
                    var argType, nodes = $.map(arguments, function (arg) {
                            argType = type(arg);
                            return argType == 'object' || argType == 'array' || arg == null ? arg : zepto.fragment(arg);
                        }), parent, copyByClone = this.length > 1;
                    if (nodes.length < 1)
                        return this;
                    return this.each(function (_, target) {
                        parent = inside ? target : target.parentNode;
                        target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;
                        var parentInDocument = $.contains(document.documentElement, parent);
                        nodes.forEach(function (node) {
                            if (copyByClone)
                                node = node.cloneNode(true);
                            else if (!parent)
                                return $(node).remove();
                            parent.insertBefore(node, target);
                            if (parentInDocument)
                                traverseNode(node, function (el) {
                                    if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' && (!el.type || el.type === 'text/javascript') && !el.src)
                                        window['eval'].call(window, el.innerHTML);
                                });
                        });
                    });
                };
                $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
                    $(html)[operator](this);
                    return this;
                };
            });
            zepto.Z.prototype = Z.prototype = $.fn;
            zepto.uniq = uniq;
            zepto.deserializeValue = deserializeValue;
            $.zepto = zepto;
            return $;
        }();
    ;
    (function ($) {
        var _zid = 1, undefined, slice = Array.prototype.slice, isFunction = $.isFunction, isString = function (obj) {
                return typeof obj == 'string';
            }, handlers = {}, specialEvents = {}, focusinSupported = 'onfocusin' in window, focus = {
                focus: 'focusin',
                blur: 'focusout'
            }, hover = {
                mouseenter: 'mouseover',
                mouseleave: 'mouseout'
            };
        specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';
        function zid(element) {
            return element._zid || (element._zid = _zid++);
        }
        function findHandlers(element, event, fn, selector) {
            event = parse(event);
            if (event.ns)
                var matcher = matcherFor(event.ns);
            return (handlers[zid(element)] || []).filter(function (handler) {
                return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
            });
        }
        function parse(event) {
            var parts = ('' + event).split('.');
            return {
                e: parts[0],
                ns: parts.slice(1).sort().join(' ')
            };
        }
        function matcherFor(ns) {
            return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
        }
        function eventCapture(handler, captureSetting) {
            return handler.del && (!focusinSupported && handler.e in focus) || !!captureSetting;
        }
        function realEvent(type) {
            return hover[type] || focusinSupported && focus[type] || type;
        }
        function add(element, events, fn, data, selector, delegator, capture) {
            var id = zid(element), set = handlers[id] || (handlers[id] = []);
            events.split(/\s/).forEach(function (event) {
                if (event == 'ready')
                    return $(document).ready(fn);
                var handler = parse(event);
                handler.fn = fn;
                handler.sel = selector;
                if (handler.e in hover)
                    fn = function (e) {
                        var related = e.relatedTarget;
                        if (!related || related !== this && !$.contains(this, related))
                            return handler.fn.apply(this, arguments);
                    };
                handler.del = delegator;
                var callback = delegator || fn;
                handler.proxy = function (e) {
                    e = compatible(e);
                    if (e.isImmediatePropagationStopped())
                        return;
                    e.data = data;
                    var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
                    if (result === false)
                        e.preventDefault(), e.stopPropagation();
                    return result;
                };
                handler.i = set.length;
                set.push(handler);
                if ('addEventListener' in element)
                    element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
            });
        }
        function remove(element, events, fn, selector, capture) {
            var id = zid(element);
            ;
            (events || '').split(/\s/).forEach(function (event) {
                findHandlers(element, event, fn, selector).forEach(function (handler) {
                    delete handlers[id][handler.i];
                    if ('removeEventListener' in element)
                        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
                });
            });
        }
        $.event = {
            add: add,
            remove: remove
        };
        $.proxy = function (fn, context) {
            var args = 2 in arguments && slice.call(arguments, 2);
            if (isFunction(fn)) {
                var proxyFn = function () {
                    return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments);
                };
                proxyFn._zid = zid(fn);
                return proxyFn;
            } else if (isString(context)) {
                if (args) {
                    args.unshift(fn[context], fn);
                    return $.proxy.apply(null, args);
                } else {
                    return $.proxy(fn[context], fn);
                }
            } else {
                throw new TypeError('expected function');
            }
        };
        $.fn.bind = function (event, data, callback) {
            return this.on(event, data, callback);
        };
        $.fn.unbind = function (event, callback) {
            return this.off(event, callback);
        };
        $.fn.one = function (event, selector, data, callback) {
            return this.on(event, selector, data, callback, 1);
        };
        var returnTrue = function () {
                return true;
            }, returnFalse = function () {
                return false;
            }, ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/, eventMethods = {
                preventDefault: 'isDefaultPrevented',
                stopImmediatePropagation: 'isImmediatePropagationStopped',
                stopPropagation: 'isPropagationStopped'
            };
        function compatible(event, source) {
            if (source || !event.isDefaultPrevented) {
                source || (source = event);
                $.each(eventMethods, function (name, predicate) {
                    var sourceMethod = source[name];
                    event[name] = function () {
                        this[predicate] = returnTrue;
                        return sourceMethod && sourceMethod.apply(source, arguments);
                    };
                    event[predicate] = returnFalse;
                });
                if (source.defaultPrevented !== undefined ? source.defaultPrevented : 'returnValue' in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault())
                    event.isDefaultPrevented = returnTrue;
            }
            return event;
        }
        function createProxy(event) {
            var key, proxy = { originalEvent: event };
            for (key in event)
                if (!ignoreProperties.test(key) && event[key] !== undefined)
                    proxy[key] = event[key];
            return compatible(proxy, event);
        }
        $.fn.delegate = function (selector, event, callback) {
            return this.on(event, selector, callback);
        };
        $.fn.undelegate = function (selector, event, callback) {
            return this.off(event, selector, callback);
        };
        $.fn.live = function (event, callback) {
            $(document.body).delegate(this.selector, event, callback);
            return this;
        };
        $.fn.die = function (event, callback) {
            $(document.body).undelegate(this.selector, event, callback);
            return this;
        };
        $.fn.on = function (event, selector, data, callback, one) {
            var autoRemove, delegator, $this = this;
            if (event && !isString(event)) {
                $.each(event, function (type, fn) {
                    $this.on(type, selector, data, fn, one);
                });
                return $this;
            }
            if (!isString(selector) && !isFunction(callback) && callback !== false)
                callback = data, data = selector, selector = undefined;
            if (callback === undefined || data === false)
                callback = data, data = undefined;
            if (callback === false)
                callback = returnFalse;
            return $this.each(function (_, element) {
                if (one)
                    autoRemove = function (e) {
                        remove(element, e.type, callback);
                        return callback.apply(this, arguments);
                    };
                if (selector)
                    delegator = function (e) {
                        var evt, match = $(e.target).closest(selector, element).get(0);
                        if (match && match !== element) {
                            evt = $.extend(createProxy(e), {
                                currentTarget: match,
                                liveFired: element
                            });
                            return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
                        }
                    };
                add(element, event, callback, data, selector, delegator || autoRemove);
            });
        };
        $.fn.off = function (event, selector, callback) {
            var $this = this;
            if (event && !isString(event)) {
                $.each(event, function (type, fn) {
                    $this.off(type, selector, fn);
                });
                return $this;
            }
            if (!isString(selector) && !isFunction(callback) && callback !== false)
                callback = selector, selector = undefined;
            if (callback === false)
                callback = returnFalse;
            return $this.each(function () {
                remove(this, event, callback, selector);
            });
        };
        $.fn.trigger = function (event, args) {
            event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event);
            event._args = args;
            return this.each(function () {
                if (event.type in focus && typeof this[event.type] == 'function')
                    this[event.type]();
                else if ('dispatchEvent' in this)
                    this.dispatchEvent(event);
                else
                    $(this).triggerHandler(event, args);
            });
        };
        $.fn.triggerHandler = function (event, args) {
            var e, result;
            this.each(function (i, element) {
                e = createProxy(isString(event) ? $.Event(event) : event);
                e._args = args;
                e.target = element;
                $.each(findHandlers(element, event.type || event), function (i, handler) {
                    result = handler.proxy(e);
                    if (e.isImmediatePropagationStopped())
                        return false;
                });
            });
            return result;
        };
        ;
        ('focusin focusout focus blur load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select keydown keypress keyup error').split(' ').forEach(function (event) {
            $.fn[event] = function (callback) {
                return 0 in arguments ? this.bind(event, callback) : this.trigger(event);
            };
        });
        $.Event = function (type, props) {
            if (!isString(type))
                props = type, type = props.type;
            var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true;
            if (props)
                for (var name in props)
                    name == 'bubbles' ? bubbles = !!props[name] : event[name] = props[name];
            event.initEvent(type, bubbles, true);
            return compatible(event);
        };
    }(Zepto));
    return Zepto;
});

;
(function () {
    var undefined;
    var VERSION = '3.8.0';
    var BIND_FLAG = 1, BIND_KEY_FLAG = 2, CURRY_BOUND_FLAG = 4, CURRY_FLAG = 8, CURRY_RIGHT_FLAG = 16, PARTIAL_FLAG = 32, PARTIAL_RIGHT_FLAG = 64, ARY_FLAG = 128, REARG_FLAG = 256;
    var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = '...';
    var HOT_COUNT = 150, HOT_SPAN = 16;
    var LAZY_DROP_WHILE_FLAG = 0, LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2;
    var FUNC_ERROR_TEXT = 'Expected a function';
    var PLACEHOLDER = '__lodash_placeholder__';
    var argsTag = '[object Arguments]', arrayTag = '[object Array]', boolTag = '[object Boolean]', dateTag = '[object Date]', errorTag = '[object Error]', funcTag = '[object Function]', mapTag = '[object Map]', numberTag = '[object Number]', objectTag = '[object Object]', regexpTag = '[object RegExp]', setTag = '[object Set]', stringTag = '[object String]', weakMapTag = '[object WeakMap]';
    var arrayBufferTag = '[object ArrayBuffer]', float32Tag = '[object Float32Array]', float64Tag = '[object Float64Array]', int8Tag = '[object Int8Array]', int16Tag = '[object Int16Array]', int32Tag = '[object Int32Array]', uint8Tag = '[object Uint8Array]', uint8ClampedTag = '[object Uint8ClampedArray]', uint16Tag = '[object Uint16Array]', uint32Tag = '[object Uint32Array]';
    var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
    var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g, reUnescapedHtml = /[&<>"'`]/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
    var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
    var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g, reHasRegExpChars = RegExp(reRegExpChars.source);
    var reComboMark = /[\u0300-\u036f\ufe20-\ufe23]/g;
    var reEscapeChar = /\\(\\)?/g;
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
    var reFlags = /\w*$/;
    var reHasHexPrefix = /^0[xX]/;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;
    var reNoMatch = /($^)/;
    var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
    var reWords = function () {
            var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]', lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';
            return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
        }();
    var whitespace = ' \t\x0B\f\xA0\uFEFF' + '\n\r\u2028\u2029' + '\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000';
    var contextProps = [
            'Array',
            'ArrayBuffer',
            'Date',
            'Error',
            'Float32Array',
            'Float64Array',
            'Function',
            'Int8Array',
            'Int16Array',
            'Int32Array',
            'Math',
            'Number',
            'Object',
            'RegExp',
            'Set',
            'String',
            '_',
            'clearTimeout',
            'document',
            'isFinite',
            'parseInt',
            'setTimeout',
            'TypeError',
            'Uint8Array',
            'Uint8ClampedArray',
            'Uint16Array',
            'Uint32Array',
            'WeakMap',
            'window'
        ];
    var templateCounter = -1;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[stringTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[mapTag] = cloneableTags[setTag] = cloneableTags[weakMapTag] = false;
    var debounceOptions = {
            'leading': false,
            'maxWait': 0,
            'trailing': false
        };
    var deburredLetters = {
            '\xC0': 'A',
            '\xC1': 'A',
            '\xC2': 'A',
            '\xC3': 'A',
            '\xC4': 'A',
            '\xC5': 'A',
            '\xE0': 'a',
            '\xE1': 'a',
            '\xE2': 'a',
            '\xE3': 'a',
            '\xE4': 'a',
            '\xE5': 'a',
            '\xC7': 'C',
            '\xE7': 'c',
            '\xD0': 'D',
            '\xF0': 'd',
            '\xC8': 'E',
            '\xC9': 'E',
            '\xCA': 'E',
            '\xCB': 'E',
            '\xE8': 'e',
            '\xE9': 'e',
            '\xEA': 'e',
            '\xEB': 'e',
            '\xCC': 'I',
            '\xCD': 'I',
            '\xCE': 'I',
            '\xCF': 'I',
            '\xEC': 'i',
            '\xED': 'i',
            '\xEE': 'i',
            '\xEF': 'i',
            '\xD1': 'N',
            '\xF1': 'n',
            '\xD2': 'O',
            '\xD3': 'O',
            '\xD4': 'O',
            '\xD5': 'O',
            '\xD6': 'O',
            '\xD8': 'O',
            '\xF2': 'o',
            '\xF3': 'o',
            '\xF4': 'o',
            '\xF5': 'o',
            '\xF6': 'o',
            '\xF8': 'o',
            '\xD9': 'U',
            '\xDA': 'U',
            '\xDB': 'U',
            '\xDC': 'U',
            '\xF9': 'u',
            '\xFA': 'u',
            '\xFB': 'u',
            '\xFC': 'u',
            '\xDD': 'Y',
            '\xFD': 'y',
            '\xFF': 'y',
            '\xC6': 'Ae',
            '\xE6': 'ae',
            '\xDE': 'Th',
            '\xFE': 'th',
            '\xDF': 'ss'
        };
    var htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '`': '&#96;'
        };
    var htmlUnescapes = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': '\'',
            '&#96;': '`'
        };
    var objectTypes = {
            'function': true,
            'object': true
        };
    var stringEscapes = {
            '\\': '\\',
            '\'': '\'',
            '\n': 'n',
            '\r': 'r',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        };
    var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
    var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
    var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;
    var freeSelf = objectTypes[typeof self] && self && self.Object && self;
    var freeWindow = objectTypes[typeof window] && window && window.Object && window;
    var root = freeGlobal || freeWindow !== (this && this.window) && freeWindow || freeSelf || this;
    function baseCompareAscending(value, other) {
        if (value !== other) {
            var valIsReflexive = value === value, othIsReflexive = other === other;
            if (value > other || !valIsReflexive || value === undefined && othIsReflexive) {
                return 1;
            }
            if (value < other || !othIsReflexive || other === undefined && valIsReflexive) {
                return -1;
            }
        }
        return 0;
    }
    function baseFindIndex(array, predicate, fromRight) {
        var length = array.length, index = fromRight ? length : -1;
        while (fromRight ? index-- : ++index < length) {
            if (predicate(array[index], index, array)) {
                return index;
            }
        }
        return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
        if (value !== value) {
            return indexOfNaN(array, fromIndex);
        }
        var index = fromIndex - 1, length = array.length;
        while (++index < length) {
            if (array[index] === value) {
                return index;
            }
        }
        return -1;
    }
    function baseIsFunction(value) {
        return typeof value == 'function' || false;
    }
    function baseToString(value) {
        if (typeof value == 'string') {
            return value;
        }
        return value == null ? '' : value + '';
    }
    function charAtCallback(string) {
        return string.charCodeAt(0);
    }
    function charsLeftIndex(string, chars) {
        var index = -1, length = string.length;
        while (++index < length && chars.indexOf(string.charAt(index)) > -1) {
        }
        return index;
    }
    function charsRightIndex(string, chars) {
        var index = string.length;
        while (index-- && chars.indexOf(string.charAt(index)) > -1) {
        }
        return index;
    }
    function compareAscending(object, other) {
        return baseCompareAscending(object.criteria, other.criteria) || object.index - other.index;
    }
    function compareMultiple(object, other, orders) {
        var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
        while (++index < length) {
            var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
            if (result) {
                if (index >= ordersLength) {
                    return result;
                }
                return result * (orders[index] ? 1 : -1);
            }
        }
        return object.index - other.index;
    }
    function deburrLetter(letter) {
        return deburredLetters[letter];
    }
    function escapeHtmlChar(chr) {
        return htmlEscapes[chr];
    }
    function escapeStringChar(chr) {
        return '\\' + stringEscapes[chr];
    }
    function indexOfNaN(array, fromIndex, fromRight) {
        var length = array.length, index = fromIndex + (fromRight ? 0 : -1);
        while (fromRight ? index-- : ++index < length) {
            var other = array[index];
            if (other !== other) {
                return index;
            }
        }
        return -1;
    }
    function isObjectLike(value) {
        return !!value && typeof value == 'object';
    }
    function isSpace(charCode) {
        return charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160 || charCode == 5760 || charCode == 6158 || charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279);
    }
    function replaceHolders(array, placeholder) {
        var index = -1, length = array.length, resIndex = -1, result = [];
        while (++index < length) {
            if (array[index] === placeholder) {
                array[index] = PLACEHOLDER;
                result[++resIndex] = index;
            }
        }
        return result;
    }
    function sortedUniq(array, iteratee) {
        var seen, index = -1, length = array.length, resIndex = -1, result = [];
        while (++index < length) {
            var value = array[index], computed = iteratee ? iteratee(value, index, array) : value;
            if (!index || seen !== computed) {
                seen = computed;
                result[++resIndex] = value;
            }
        }
        return result;
    }
    function trimmedLeftIndex(string) {
        var index = -1, length = string.length;
        while (++index < length && isSpace(string.charCodeAt(index))) {
        }
        return index;
    }
    function trimmedRightIndex(string) {
        var index = string.length;
        while (index-- && isSpace(string.charCodeAt(index))) {
        }
        return index;
    }
    function unescapeHtmlChar(chr) {
        return htmlUnescapes[chr];
    }
    function runInContext(context) {
        context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;
        var Array = context.Array, Date = context.Date, Error = context.Error, Function = context.Function, Math = context.Math, Number = context.Number, Object = context.Object, RegExp = context.RegExp, String = context.String, TypeError = context.TypeError;
        var arrayProto = Array.prototype, objectProto = Object.prototype, stringProto = String.prototype;
        var document = (document = context.window) && document.document;
        var fnToString = Function.prototype.toString;
        var hasOwnProperty = objectProto.hasOwnProperty;
        var idCounter = 0;
        var objToString = objectProto.toString;
        var oldDash = context._;
        var reIsNative = RegExp('^' + escapeRegExp(objToString).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
        var ArrayBuffer = isNative(ArrayBuffer = context.ArrayBuffer) && ArrayBuffer, bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice, ceil = Math.ceil, clearTimeout = context.clearTimeout, floor = Math.floor, getOwnPropertySymbols = isNative(getOwnPropertySymbols = Object.getOwnPropertySymbols) && getOwnPropertySymbols, getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf, push = arrayProto.push, preventExtensions = isNative(preventExtensions = Object.preventExtensions) && preventExtensions, propertyIsEnumerable = objectProto.propertyIsEnumerable, Set = isNative(Set = context.Set) && Set, setTimeout = context.setTimeout, splice = arrayProto.splice, Uint8Array = isNative(Uint8Array = context.Uint8Array) && Uint8Array, WeakMap = isNative(WeakMap = context.WeakMap) && WeakMap;
        var Float64Array = function () {
                try {
                    var func = isNative(func = context.Float64Array) && func, result = new func(new ArrayBuffer(10), 0, 1) && func;
                } catch (e) {
                }
                return result;
            }();
        var nativeAssign = function () {
                var func = preventExtensions && isNative(func = Object.assign) && func;
                try {
                    if (func) {
                        var object = preventExtensions({ '1': 0 });
                        object[0] = 1;
                    }
                } catch (e) {
                    try {
                        func(object, 'xo');
                    } catch (e) {
                    }
                    return !object[1] && func;
                }
                return false;
            }();
        var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray, nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate, nativeIsFinite = context.isFinite, nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys, nativeMax = Math.max, nativeMin = Math.min, nativeNow = isNative(nativeNow = Date.now) && nativeNow, nativeNumIsFinite = isNative(nativeNumIsFinite = Number.isFinite) && nativeNumIsFinite, nativeParseInt = context.parseInt, nativeRandom = Math.random;
        var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY, POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
        var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
        var FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0;
        var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
        var metaMap = WeakMap && new WeakMap();
        var realNames = {};
        function lodash(value) {
            if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
                if (value instanceof LodashWrapper) {
                    return value;
                }
                if (hasOwnProperty.call(value, '__chain__') && hasOwnProperty.call(value, '__wrapped__')) {
                    return wrapperClone(value);
                }
            }
            return new LodashWrapper(value);
        }
        function baseLodash() {
        }
        function LodashWrapper(value, chainAll, actions) {
            this.__wrapped__ = value;
            this.__actions__ = actions || [];
            this.__chain__ = !!chainAll;
        }
        var support = lodash.support = {};
        (function (x) {
            var Ctor = function () {
                    this.x = x;
                }, args = arguments, object = {
                    '0': x,
                    'length': x
                }, props = [];
            Ctor.prototype = {
                'valueOf': x,
                'y': x
            };
            for (var key in new Ctor()) {
                props.push(key);
            }
            support.funcDecomp = /\bthis\b/.test(function () {
                return this;
            });
            support.funcNames = typeof Function.name == 'string';
            try {
                support.dom = document.createDocumentFragment().nodeType === 11;
            } catch (e) {
                support.dom = false;
            }
            try {
                support.nonEnumArgs = !propertyIsEnumerable.call(args, 1);
            } catch (e) {
                support.nonEnumArgs = true;
            }
        }(1, 0));
        lodash.templateSettings = {
            'escape': reEscape,
            'evaluate': reEvaluate,
            'interpolate': reInterpolate,
            'variable': '',
            'imports': { '_': lodash }
        };
        function LazyWrapper(value) {
            this.__wrapped__ = value;
            this.__actions__ = null;
            this.__dir__ = 1;
            this.__dropCount__ = 0;
            this.__filtered__ = false;
            this.__iteratees__ = null;
            this.__takeCount__ = POSITIVE_INFINITY;
            this.__views__ = null;
        }
        function lazyClone() {
            var actions = this.__actions__, iteratees = this.__iteratees__, views = this.__views__, result = new LazyWrapper(this.__wrapped__);
            result.__actions__ = actions ? arrayCopy(actions) : null;
            result.__dir__ = this.__dir__;
            result.__filtered__ = this.__filtered__;
            result.__iteratees__ = iteratees ? arrayCopy(iteratees) : null;
            result.__takeCount__ = this.__takeCount__;
            result.__views__ = views ? arrayCopy(views) : null;
            return result;
        }
        function lazyReverse() {
            if (this.__filtered__) {
                var result = new LazyWrapper(this);
                result.__dir__ = -1;
                result.__filtered__ = true;
            } else {
                result = this.clone();
                result.__dir__ *= -1;
            }
            return result;
        }
        function lazyValue() {
            var array = this.__wrapped__.value();
            if (!isArray(array)) {
                return baseWrapperValue(array, this.__actions__);
            }
            var dir = this.__dir__, isRight = dir < 0, view = getView(0, array.length, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, takeCount = nativeMin(length, this.__takeCount__), iteratees = this.__iteratees__, iterLength = iteratees ? iteratees.length : 0, resIndex = 0, result = [];
            outer:
                while (length-- && resIndex < takeCount) {
                    index += dir;
                    var iterIndex = -1, value = array[index];
                    while (++iterIndex < iterLength) {
                        var data = iteratees[iterIndex], iteratee = data.iteratee, type = data.type;
                        if (type == LAZY_DROP_WHILE_FLAG) {
                            if (data.done && (isRight ? index > data.index : index < data.index)) {
                                data.count = 0;
                                data.done = false;
                            }
                            data.index = index;
                            if (!data.done) {
                                var limit = data.limit;
                                if (!(data.done = limit > -1 ? data.count++ >= limit : !iteratee(value))) {
                                    continue outer;
                                }
                            }
                        } else {
                            var computed = iteratee(value);
                            if (type == LAZY_MAP_FLAG) {
                                value = computed;
                            } else if (!computed) {
                                if (type == LAZY_FILTER_FLAG) {
                                    continue outer;
                                } else {
                                    break outer;
                                }
                            }
                        }
                    }
                    result[resIndex++] = value;
                }
            return result;
        }
        function MapCache() {
            this.__data__ = {};
        }
        function mapDelete(key) {
            return this.has(key) && delete this.__data__[key];
        }
        function mapGet(key) {
            return key == '__proto__' ? undefined : this.__data__[key];
        }
        function mapHas(key) {
            return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
        }
        function mapSet(key, value) {
            if (key != '__proto__') {
                this.__data__[key] = value;
            }
            return this;
        }
        function SetCache(values) {
            var length = values ? values.length : 0;
            this.data = {
                'hash': nativeCreate(null),
                'set': new Set()
            };
            while (length--) {
                this.push(values[length]);
            }
        }
        function cacheIndexOf(cache, value) {
            var data = cache.data, result = typeof value == 'string' || isObject(value) ? data.set.has(value) : data.hash[value];
            return result ? 0 : -1;
        }
        function cachePush(value) {
            var data = this.data;
            if (typeof value == 'string' || isObject(value)) {
                data.set.add(value);
            } else {
                data.hash[value] = true;
            }
        }
        function arrayCopy(source, array) {
            var index = -1, length = source.length;
            array || (array = Array(length));
            while (++index < length) {
                array[index] = source[index];
            }
            return array;
        }
        function arrayEach(array, iteratee) {
            var index = -1, length = array.length;
            while (++index < length) {
                if (iteratee(array[index], index, array) === false) {
                    break;
                }
            }
            return array;
        }
        function arrayEachRight(array, iteratee) {
            var length = array.length;
            while (length--) {
                if (iteratee(array[length], length, array) === false) {
                    break;
                }
            }
            return array;
        }
        function arrayEvery(array, predicate) {
            var index = -1, length = array.length;
            while (++index < length) {
                if (!predicate(array[index], index, array)) {
                    return false;
                }
            }
            return true;
        }
        function arrayFilter(array, predicate) {
            var index = -1, length = array.length, resIndex = -1, result = [];
            while (++index < length) {
                var value = array[index];
                if (predicate(value, index, array)) {
                    result[++resIndex] = value;
                }
            }
            return result;
        }
        function arrayMap(array, iteratee) {
            var index = -1, length = array.length, result = Array(length);
            while (++index < length) {
                result[index] = iteratee(array[index], index, array);
            }
            return result;
        }
        function arrayMax(array) {
            var index = -1, length = array.length, result = NEGATIVE_INFINITY;
            while (++index < length) {
                var value = array[index];
                if (value > result) {
                    result = value;
                }
            }
            return result;
        }
        function arrayMin(array) {
            var index = -1, length = array.length, result = POSITIVE_INFINITY;
            while (++index < length) {
                var value = array[index];
                if (value < result) {
                    result = value;
                }
            }
            return result;
        }
        function arrayReduce(array, iteratee, accumulator, initFromArray) {
            var index = -1, length = array.length;
            if (initFromArray && length) {
                accumulator = array[++index];
            }
            while (++index < length) {
                accumulator = iteratee(accumulator, array[index], index, array);
            }
            return accumulator;
        }
        function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
            var length = array.length;
            if (initFromArray && length) {
                accumulator = array[--length];
            }
            while (length--) {
                accumulator = iteratee(accumulator, array[length], length, array);
            }
            return accumulator;
        }
        function arraySome(array, predicate) {
            var index = -1, length = array.length;
            while (++index < length) {
                if (predicate(array[index], index, array)) {
                    return true;
                }
            }
            return false;
        }
        function arraySum(array) {
            var length = array.length, result = 0;
            while (length--) {
                result += +array[length] || 0;
            }
            return result;
        }
        function assignDefaults(objectValue, sourceValue) {
            return objectValue === undefined ? sourceValue : objectValue;
        }
        function assignOwnDefaults(objectValue, sourceValue, key, object) {
            return objectValue === undefined || !hasOwnProperty.call(object, key) ? sourceValue : objectValue;
        }
        function assignWith(object, source, customizer) {
            var props = keys(source);
            push.apply(props, getSymbols(source));
            var index = -1, length = props.length;
            while (++index < length) {
                var key = props[index], value = object[key], result = customizer(value, source[key], key, object, source);
                if ((result === result ? result !== value : value === value) || value === undefined && !(key in object)) {
                    object[key] = result;
                }
            }
            return object;
        }
        var baseAssign = nativeAssign || function (object, source) {
                return source == null ? object : baseCopy(source, getSymbols(source), baseCopy(source, keys(source), object));
            };
        function baseAt(collection, props) {
            var index = -1, isNil = collection == null, isArr = !isNil && isArrayLike(collection), length = isArr && collection.length, propsLength = props.length, result = Array(propsLength);
            while (++index < propsLength) {
                var key = props[index];
                if (isArr) {
                    result[index] = isIndex(key, length) ? collection[key] : undefined;
                } else {
                    result[index] = isNil ? undefined : collection[key];
                }
            }
            return result;
        }
        function baseCopy(source, props, object) {
            object || (object = {});
            var index = -1, length = props.length;
            while (++index < length) {
                var key = props[index];
                object[key] = source[key];
            }
            return object;
        }
        function baseCallback(func, thisArg, argCount) {
            var type = typeof func;
            if (type == 'function') {
                return thisArg === undefined ? func : bindCallback(func, thisArg, argCount);
            }
            if (func == null) {
                return identity;
            }
            if (type == 'object') {
                return baseMatches(func);
            }
            return thisArg === undefined ? property(func) : baseMatchesProperty(func, thisArg);
        }
        function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
            var result;
            if (customizer) {
                result = object ? customizer(value, key, object) : customizer(value);
            }
            if (result !== undefined) {
                return result;
            }
            if (!isObject(value)) {
                return value;
            }
            var isArr = isArray(value);
            if (isArr) {
                result = initCloneArray(value);
                if (!isDeep) {
                    return arrayCopy(value, result);
                }
            } else {
                var tag = objToString.call(value), isFunc = tag == funcTag;
                if (tag == objectTag || tag == argsTag || isFunc && !object) {
                    result = initCloneObject(isFunc ? {} : value);
                    if (!isDeep) {
                        return baseAssign(result, value);
                    }
                } else {
                    return cloneableTags[tag] ? initCloneByTag(value, tag, isDeep) : object ? value : {};
                }
            }
            stackA || (stackA = []);
            stackB || (stackB = []);
            var length = stackA.length;
            while (length--) {
                if (stackA[length] == value) {
                    return stackB[length];
                }
            }
            stackA.push(value);
            stackB.push(result);
            (isArr ? arrayEach : baseForOwn)(value, function (subValue, key) {
                result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
            });
            return result;
        }
        var baseCreate = function () {
                function Object() {
                }
                return function (prototype) {
                    if (isObject(prototype)) {
                        Object.prototype = prototype;
                        var result = new Object();
                        Object.prototype = null;
                    }
                    return result || context.Object();
                };
            }();
        function baseDelay(func, wait, args) {
            if (typeof func != 'function') {
                throw new TypeError(FUNC_ERROR_TEXT);
            }
            return setTimeout(function () {
                func.apply(undefined, args);
            }, wait);
        }
        function baseDifference(array, values) {
            var length = array ? array.length : 0, result = [];
            if (!length) {
                return result;
            }
            var index = -1, indexOf = getIndexOf(), isCommon = indexOf == baseIndexOf, cache = isCommon && values.length >= 200 ? createCache(values) : null, valuesLength = values.length;
            if (cache) {
                indexOf = cacheIndexOf;
                isCommon = false;
                values = cache;
            }
            outer:
                while (++index < length) {
                    var value = array[index];
                    if (isCommon && value === value) {
                        var valuesIndex = valuesLength;
                        while (valuesIndex--) {
                            if (values[valuesIndex] === value) {
                                continue outer;
                            }
                        }
                        result.push(value);
                    } else if (indexOf(values, value, 0) < 0) {
                        result.push(value);
                    }
                }
            return result;
        }
        var baseEach = createBaseEach(baseForOwn);
        var baseEachRight = createBaseEach(baseForOwnRight, true);
        function baseEvery(collection, predicate) {
            var result = true;
            baseEach(collection, function (value, index, collection) {
                result = !!predicate(value, index, collection);
                return result;
            });
            return result;
        }
        function baseFill(array, value, start, end) {
            var length = array.length;
            start = start == null ? 0 : +start || 0;
            if (start < 0) {
                start = -start > length ? 0 : length + start;
            }
            end = end === undefined || end > length ? length : +end || 0;
            if (end < 0) {
                end += length;
            }
            length = start > end ? 0 : end >>> 0;
            start >>>= 0;
            while (start < length) {
                array[start++] = value;
            }
            return array;
        }
        function baseFilter(collection, predicate) {
            var result = [];
            baseEach(collection, function (value, index, collection) {
                if (predicate(value, index, collection)) {
                    result.push(value);
                }
            });
            return result;
        }
        function baseFind(collection, predicate, eachFunc, retKey) {
            var result;
            eachFunc(collection, function (value, key, collection) {
                if (predicate(value, key, collection)) {
                    result = retKey ? key : value;
                    return false;
                }
            });
            return result;
        }
        function baseFlatten(array, isDeep, isStrict) {
            var index = -1, length = array.length, resIndex = -1, result = [];
            while (++index < length) {
                var value = array[index];
                if (isObjectLike(value) && isArrayLike(value) && (isStrict || isArray(value) || isArguments(value))) {
                    if (isDeep) {
                        value = baseFlatten(value, isDeep, isStrict);
                    }
                    var valIndex = -1, valLength = value.length;
                    while (++valIndex < valLength) {
                        result[++resIndex] = value[valIndex];
                    }
                } else if (!isStrict) {
                    result[++resIndex] = value;
                }
            }
            return result;
        }
        var baseFor = createBaseFor();
        var baseForRight = createBaseFor(true);
        function baseForIn(object, iteratee) {
            return baseFor(object, iteratee, keysIn);
        }
        function baseForOwn(object, iteratee) {
            return baseFor(object, iteratee, keys);
        }
        function baseForOwnRight(object, iteratee) {
            return baseForRight(object, iteratee, keys);
        }
        function baseFunctions(object, props) {
            var index = -1, length = props.length, resIndex = -1, result = [];
            while (++index < length) {
                var key = props[index];
                if (isFunction(object[key])) {
                    result[++resIndex] = key;
                }
            }
            return result;
        }
        function baseGet(object, path, pathKey) {
            if (object == null) {
                return;
            }
            if (pathKey !== undefined && pathKey in toObject(object)) {
                path = [pathKey];
            }
            var index = -1, length = path.length;
            while (object != null && ++index < length) {
                object = object[path[index]];
            }
            return index && index == length ? object : undefined;
        }
        function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
            if (value === other) {
                return true;
            }
            var valType = typeof value, othType = typeof other;
            if (valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object' || value == null || other == null) {
                return value !== value && other !== other;
            }
            return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
        }
        function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
            var objIsArr = isArray(object), othIsArr = isArray(other), objTag = arrayTag, othTag = arrayTag;
            if (!objIsArr) {
                objTag = objToString.call(object);
                if (objTag == argsTag) {
                    objTag = objectTag;
                } else if (objTag != objectTag) {
                    objIsArr = isTypedArray(object);
                }
            }
            if (!othIsArr) {
                othTag = objToString.call(other);
                if (othTag == argsTag) {
                    othTag = objectTag;
                } else if (othTag != objectTag) {
                    othIsArr = isTypedArray(other);
                }
            }
            var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
            if (isSameTag && !(objIsArr || objIsObj)) {
                return equalByTag(object, other, objTag);
            }
            if (!isLoose) {
                var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'), othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
                if (valWrapped || othWrapped) {
                    return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
                }
            }
            if (!isSameTag) {
                return false;
            }
            stackA || (stackA = []);
            stackB || (stackB = []);
            var length = stackA.length;
            while (length--) {
                if (stackA[length] == object) {
                    return stackB[length] == other;
                }
            }
            stackA.push(object);
            stackB.push(other);
            var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);
            stackA.pop();
            stackB.pop();
            return result;
        }
        function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
            var index = -1, length = props.length, noCustomizer = !customizer;
            while (++index < length) {
                if (noCustomizer && strictCompareFlags[index] ? values[index] !== object[props[index]] : !(props[index] in object)) {
                    return false;
                }
            }
            index = -1;
            while (++index < length) {
                var key = props[index], objValue = object[key], srcValue = values[index];
                if (noCustomizer && strictCompareFlags[index]) {
                    var result = objValue !== undefined || key in object;
                } else {
                    result = customizer ? customizer(objValue, srcValue, key) : undefined;
                    if (result === undefined) {
                        result = baseIsEqual(srcValue, objValue, customizer, true);
                    }
                }
                if (!result) {
                    return false;
                }
            }
            return true;
        }
        function baseMap(collection, iteratee) {
            var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
            baseEach(collection, function (value, key, collection) {
                result[++index] = iteratee(value, key, collection);
            });
            return result;
        }
        function baseMatches(source) {
            var props = keys(source), length = props.length;
            if (!length) {
                return constant(true);
            }
            if (length == 1) {
                var key = props[0], value = source[key];
                if (isStrictComparable(value)) {
                    return function (object) {
                        if (object == null) {
                            return false;
                        }
                        return object[key] === value && (value !== undefined || key in toObject(object));
                    };
                }
            }
            var values = Array(length), strictCompareFlags = Array(length);
            while (length--) {
                value = source[props[length]];
                values[length] = value;
                strictCompareFlags[length] = isStrictComparable(value);
            }
            return function (object) {
                return object != null && baseIsMatch(toObject(object), props, values, strictCompareFlags);
            };
        }
        function baseMatchesProperty(path, value) {
            var isArr = isArray(path), isCommon = isKey(path) && isStrictComparable(value), pathKey = path + '';
            path = toPath(path);
            return function (object) {
                if (object == null) {
                    return false;
                }
                var key = pathKey;
                object = toObject(object);
                if ((isArr || !isCommon) && !(key in object)) {
                    object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
                    if (object == null) {
                        return false;
                    }
                    key = last(path);
                    object = toObject(object);
                }
                return object[key] === value ? value !== undefined || key in object : baseIsEqual(value, object[key], null, true);
            };
        }
        function baseMerge(object, source, customizer, stackA, stackB) {
            if (!isObject(object)) {
                return object;
            }
            var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source));
            if (!isSrcArr) {
                var props = keys(source);
                push.apply(props, getSymbols(source));
            }
            arrayEach(props || source, function (srcValue, key) {
                if (props) {
                    key = srcValue;
                    srcValue = source[key];
                }
                if (isObjectLike(srcValue)) {
                    stackA || (stackA = []);
                    stackB || (stackB = []);
                    baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
                } else {
                    var value = object[key], result = customizer ? customizer(value, srcValue, key, object, source) : undefined, isCommon = result === undefined;
                    if (isCommon) {
                        result = srcValue;
                    }
                    if ((isSrcArr || result !== undefined) && (isCommon || (result === result ? result !== value : value === value))) {
                        object[key] = result;
                    }
                }
            });
            return object;
        }
        function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
            var length = stackA.length, srcValue = source[key];
            while (length--) {
                if (stackA[length] == srcValue) {
                    object[key] = stackB[length];
                    return;
                }
            }
            var value = object[key], result = customizer ? customizer(value, srcValue, key, object, source) : undefined, isCommon = result === undefined;
            if (isCommon) {
                result = srcValue;
                if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
                    result = isArray(value) ? value : isArrayLike(value) ? arrayCopy(value) : [];
                } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
                    result = isArguments(value) ? toPlainObject(value) : isPlainObject(value) ? value : {};
                } else {
                    isCommon = false;
                }
            }
            stackA.push(srcValue);
            stackB.push(result);
            if (isCommon) {
                object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
            } else if (result === result ? result !== value : value === value) {
                object[key] = result;
            }
        }
        function baseProperty(key) {
            return function (object) {
                return object == null ? undefined : object[key];
            };
        }
        function basePropertyDeep(path) {
            var pathKey = path + '';
            path = toPath(path);
            return function (object) {
                return baseGet(object, path, pathKey);
            };
        }
        function basePullAt(array, indexes) {
            var length = array ? indexes.length : 0;
            while (length--) {
                var index = parseFloat(indexes[length]);
                if (index != previous && isIndex(index)) {
                    var previous = index;
                    splice.call(array, index, 1);
                }
            }
            return array;
        }
        function baseRandom(min, max) {
            return min + floor(nativeRandom() * (max - min + 1));
        }
        function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
            eachFunc(collection, function (value, index, collection) {
                accumulator = initFromCollection ? (initFromCollection = false, value) : iteratee(accumulator, value, index, collection);
            });
            return accumulator;
        }
        var baseSetData = !metaMap ? identity : function (func, data) {
                metaMap.set(func, data);
                return func;
            };
        function baseSlice(array, start, end) {
            var index = -1, length = array.length;
            start = start == null ? 0 : +start || 0;
            if (start < 0) {
                start = -start > length ? 0 : length + start;
            }
            end = end === undefined || end > length ? length : +end || 0;
            if (end < 0) {
                end += length;
            }
            length = start > end ? 0 : end - start >>> 0;
            start >>>= 0;
            var result = Array(length);
            while (++index < length) {
                result[index] = array[index + start];
            }
            return result;
        }
        function baseSome(collection, predicate) {
            var result;
            baseEach(collection, function (value, index, collection) {
                result = predicate(value, index, collection);
                return !result;
            });
            return !!result;
        }
        function baseSortBy(array, comparer) {
            var length = array.length;
            array.sort(comparer);
            while (length--) {
                array[length] = array[length].value;
            }
            return array;
        }
        function baseSortByOrder(collection, iteratees, orders) {
            var callback = getCallback(), index = -1;
            iteratees = arrayMap(iteratees, function (iteratee) {
                return callback(iteratee);
            });
            var result = baseMap(collection, function (value) {
                    var criteria = arrayMap(iteratees, function (iteratee) {
                            return iteratee(value);
                        });
                    return {
                        'criteria': criteria,
                        'index': ++index,
                        'value': value
                    };
                });
            return baseSortBy(result, function (object, other) {
                return compareMultiple(object, other, orders);
            });
        }
        function baseSum(collection, iteratee) {
            var result = 0;
            baseEach(collection, function (value, index, collection) {
                result += +iteratee(value, index, collection) || 0;
            });
            return result;
        }
        function baseUniq(array, iteratee) {
            var index = -1, indexOf = getIndexOf(), length = array.length, isCommon = indexOf == baseIndexOf, isLarge = isCommon && length >= 200, seen = isLarge ? createCache() : null, result = [];
            if (seen) {
                indexOf = cacheIndexOf;
                isCommon = false;
            } else {
                isLarge = false;
                seen = iteratee ? [] : result;
            }
            outer:
                while (++index < length) {
                    var value = array[index], computed = iteratee ? iteratee(value, index, array) : value;
                    if (isCommon && value === value) {
                        var seenIndex = seen.length;
                        while (seenIndex--) {
                            if (seen[seenIndex] === computed) {
                                continue outer;
                            }
                        }
                        if (iteratee) {
                            seen.push(computed);
                        }
                        result.push(value);
                    } else if (indexOf(seen, computed, 0) < 0) {
                        if (iteratee || isLarge) {
                            seen.push(computed);
                        }
                        result.push(value);
                    }
                }
            return result;
        }
        function baseValues(object, props) {
            var index = -1, length = props.length, result = Array(length);
            while (++index < length) {
                result[index] = object[props[index]];
            }
            return result;
        }
        function baseWhile(array, predicate, isDrop, fromRight) {
            var length = array.length, index = fromRight ? length : -1;
            while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {
            }
            return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
        }
        function baseWrapperValue(value, actions) {
            var result = value;
            if (result instanceof LazyWrapper) {
                result = result.value();
            }
            var index = -1, length = actions.length;
            while (++index < length) {
                var args = [result], action = actions[index];
                push.apply(args, action.args);
                result = action.func.apply(action.thisArg, args);
            }
            return result;
        }
        function binaryIndex(array, value, retHighest) {
            var low = 0, high = array ? array.length : low;
            if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
                while (low < high) {
                    var mid = low + high >>> 1, computed = array[mid];
                    if (retHighest ? computed <= value : computed < value) {
                        low = mid + 1;
                    } else {
                        high = mid;
                    }
                }
                return high;
            }
            return binaryIndexBy(array, value, identity, retHighest);
        }
        function binaryIndexBy(array, value, iteratee, retHighest) {
            value = iteratee(value);
            var low = 0, high = array ? array.length : 0, valIsNaN = value !== value, valIsUndef = value === undefined;
            while (low < high) {
                var mid = floor((low + high) / 2), computed = iteratee(array[mid]), isReflexive = computed === computed;
                if (valIsNaN) {
                    var setLow = isReflexive || retHighest;
                } else if (valIsUndef) {
                    setLow = isReflexive && (retHighest || computed !== undefined);
                } else {
                    setLow = retHighest ? computed <= value : computed < value;
                }
                if (setLow) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
            return nativeMin(high, MAX_ARRAY_INDEX);
        }
        function bindCallback(func, thisArg, argCount) {
            if (typeof func != 'function') {
                return identity;
            }
            if (thisArg === undefined) {
                return func;
            }
            switch (argCount) {
            case 1:
                return function (value) {
                    return func.call(thisArg, value);
                };
            case 3:
                return function (value, index, collection) {
                    return func.call(thisArg, value, index, collection);
                };
            case 4:
                return function (accumulator, value, index, collection) {
                    return func.call(thisArg, accumulator, value, index, collection);
                };
            case 5:
                return function (value, other, key, object, source) {
                    return func.call(thisArg, value, other, key, object, source);
                };
            }
            return function () {
                return func.apply(thisArg, arguments);
            };
        }
        function bufferClone(buffer) {
            return bufferSlice.call(buffer, 0);
        }
        if (!bufferSlice) {
            bufferClone = !(ArrayBuffer && Uint8Array) ? constant(null) : function (buffer) {
                var byteLength = buffer.byteLength, floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0, offset = floatLength * FLOAT64_BYTES_PER_ELEMENT, result = new ArrayBuffer(byteLength);
                if (floatLength) {
                    var view = new Float64Array(result, 0, floatLength);
                    view.set(new Float64Array(buffer, 0, floatLength));
                }
                if (byteLength != offset) {
                    view = new Uint8Array(result, offset);
                    view.set(new Uint8Array(buffer, offset));
                }
                return result;
            };
        }
        function composeArgs(args, partials, holders) {
            var holdersLength = holders.length, argsIndex = -1, argsLength = nativeMax(args.length - holdersLength, 0), leftIndex = -1, leftLength = partials.length, result = Array(argsLength + leftLength);
            while (++leftIndex < leftLength) {
                result[leftIndex] = partials[leftIndex];
            }
            while (++argsIndex < holdersLength) {
                result[holders[argsIndex]] = args[argsIndex];
            }
            while (argsLength--) {
                result[leftIndex++] = args[argsIndex++];
            }
            return result;
        }
        function composeArgsRight(args, partials, holders) {
            var holdersIndex = -1, holdersLength = holders.length, argsIndex = -1, argsLength = nativeMax(args.length - holdersLength, 0), rightIndex = -1, rightLength = partials.length, result = Array(argsLength + rightLength);
            while (++argsIndex < argsLength) {
                result[argsIndex] = args[argsIndex];
            }
            var offset = argsIndex;
            while (++rightIndex < rightLength) {
                result[offset + rightIndex] = partials[rightIndex];
            }
            while (++holdersIndex < holdersLength) {
                result[offset + holders[holdersIndex]] = args[argsIndex++];
            }
            return result;
        }
        function createAggregator(setter, initializer) {
            return function (collection, iteratee, thisArg) {
                var result = initializer ? initializer() : {};
                iteratee = getCallback(iteratee, thisArg, 3);
                if (isArray(collection)) {
                    var index = -1, length = collection.length;
                    while (++index < length) {
                        var value = collection[index];
                        setter(result, value, iteratee(value, index, collection), collection);
                    }
                } else {
                    baseEach(collection, function (value, key, collection) {
                        setter(result, value, iteratee(value, key, collection), collection);
                    });
                }
                return result;
            };
        }
        function createAssigner(assigner) {
            return restParam(function (object, sources) {
                var index = -1, length = object == null ? 0 : sources.length, customizer = length > 2 && sources[length - 2], guard = length > 2 && sources[2], thisArg = length > 1 && sources[length - 1];
                if (typeof customizer == 'function') {
                    customizer = bindCallback(customizer, thisArg, 5);
                    length -= 2;
                } else {
                    customizer = typeof thisArg == 'function' ? thisArg : null;
                    length -= customizer ? 1 : 0;
                }
                if (guard && isIterateeCall(sources[0], sources[1], guard)) {
                    customizer = length < 3 ? null : customizer;
                    length = 1;
                }
                while (++index < length) {
                    var source = sources[index];
                    if (source) {
                        assigner(object, source, customizer);
                    }
                }
                return object;
            });
        }
        function createBaseEach(eachFunc, fromRight) {
            return function (collection, iteratee) {
                var length = collection ? getLength(collection) : 0;
                if (!isLength(length)) {
                    return eachFunc(collection, iteratee);
                }
                var index = fromRight ? length : -1, iterable = toObject(collection);
                while (fromRight ? index-- : ++index < length) {
                    if (iteratee(iterable[index], index, iterable) === false) {
                        break;
                    }
                }
                return collection;
            };
        }
        function createBaseFor(fromRight) {
            return function (object, iteratee, keysFunc) {
                var iterable = toObject(object), props = keysFunc(object), length = props.length, index = fromRight ? length : -1;
                while (fromRight ? index-- : ++index < length) {
                    var key = props[index];
                    if (iteratee(iterable[key], key, iterable) === false) {
                        break;
                    }
                }
                return object;
            };
        }
        function createBindWrapper(func, thisArg) {
            var Ctor = createCtorWrapper(func);
            function wrapper() {
                var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
                return fn.apply(thisArg, arguments);
            }
            return wrapper;
        }
        var createCache = !(nativeCreate && Set) ? constant(null) : function (values) {
                return new SetCache(values);
            };
        function createCompounder(callback) {
            return function (string) {
                var index = -1, array = words(deburr(string)), length = array.length, result = '';
                while (++index < length) {
                    result = callback(result, array[index], index);
                }
                return result;
            };
        }
        function createCtorWrapper(Ctor) {
            return function () {
                var thisBinding = baseCreate(Ctor.prototype), result = Ctor.apply(thisBinding, arguments);
                return isObject(result) ? result : thisBinding;
            };
        }
        function createCurry(flag) {
            function curryFunc(func, arity, guard) {
                if (guard && isIterateeCall(func, arity, guard)) {
                    arity = null;
                }
                var result = createWrapper(func, flag, null, null, null, null, null, arity);
                result.placeholder = curryFunc.placeholder;
                return result;
            }
            return curryFunc;
        }
        function createExtremum(arrayFunc, isMin) {
            return function (collection, iteratee, thisArg) {
                if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
                    iteratee = null;
                }
                var func = getCallback(), noIteratee = iteratee == null;
                if (!(func === baseCallback && noIteratee)) {
                    noIteratee = false;
                    iteratee = func(iteratee, thisArg, 3);
                }
                if (noIteratee) {
                    var isArr = isArray(collection);
                    if (!isArr && isString(collection)) {
                        iteratee = charAtCallback;
                    } else {
                        return arrayFunc(isArr ? collection : toIterable(collection));
                    }
                }
                return extremumBy(collection, iteratee, isMin);
            };
        }
        function createFind(eachFunc, fromRight) {
            return function (collection, predicate, thisArg) {
                predicate = getCallback(predicate, thisArg, 3);
                if (isArray(collection)) {
                    var index = baseFindIndex(collection, predicate, fromRight);
                    return index > -1 ? collection[index] : undefined;
                }
                return baseFind(collection, predicate, eachFunc);
            };
        }
        function createFindIndex(fromRight) {
            return function (array, predicate, thisArg) {
                if (!(array && array.length)) {
                    return -1;
                }
                predicate = getCallback(predicate, thisArg, 3);
                return baseFindIndex(array, predicate, fromRight);
            };
        }
        function createFindKey(objectFunc) {
            return function (object, predicate, thisArg) {
                predicate = getCallback(predicate, thisArg, 3);
                return baseFind(object, predicate, objectFunc, true);
            };
        }
        function createFlow(fromRight) {
            return function () {
                var length = arguments.length;
                if (!length) {
                    return function () {
                        return arguments[0];
                    };
                }
                var wrapper, index = fromRight ? length : -1, leftIndex = 0, funcs = Array(length);
                while (fromRight ? index-- : ++index < length) {
                    var func = funcs[leftIndex++] = arguments[index];
                    if (typeof func != 'function') {
                        throw new TypeError(FUNC_ERROR_TEXT);
                    }
                    var funcName = wrapper ? '' : getFuncName(func);
                    wrapper = funcName == 'wrapper' ? new LodashWrapper([]) : wrapper;
                }
                index = wrapper ? -1 : length;
                while (++index < length) {
                    func = funcs[index];
                    funcName = getFuncName(func);
                    var data = funcName == 'wrapper' ? getData(func) : null;
                    if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
                        wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
                    } else {
                        wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
                    }
                }
                return function () {
                    var args = arguments;
                    if (wrapper && args.length == 1 && isArray(args[0])) {
                        return wrapper.plant(args[0]).value();
                    }
                    var index = 0, result = funcs[index].apply(this, args);
                    while (++index < length) {
                        result = funcs[index].call(this, result);
                    }
                    return result;
                };
            };
        }
        function createForEach(arrayFunc, eachFunc) {
            return function (collection, iteratee, thisArg) {
                return typeof iteratee == 'function' && thisArg === undefined && isArray(collection) ? arrayFunc(collection, iteratee) : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
            };
        }
        function createForIn(objectFunc) {
            return function (object, iteratee, thisArg) {
                if (typeof iteratee != 'function' || thisArg !== undefined) {
                    iteratee = bindCallback(iteratee, thisArg, 3);
                }
                return objectFunc(object, iteratee, keysIn);
            };
        }
        function createForOwn(objectFunc) {
            return function (object, iteratee, thisArg) {
                if (typeof iteratee != 'function' || thisArg !== undefined) {
                    iteratee = bindCallback(iteratee, thisArg, 3);
                }
                return objectFunc(object, iteratee);
            };
        }
        function createObjectMapper(isMapKeys) {
            return function (object, iteratee, thisArg) {
                var result = {};
                iteratee = getCallback(iteratee, thisArg, 3);
                baseForOwn(object, function (value, key, object) {
                    var mapped = iteratee(value, key, object);
                    key = isMapKeys ? mapped : key;
                    value = isMapKeys ? value : mapped;
                    result[key] = value;
                });
                return result;
            };
        }
        function createPadDir(fromRight) {
            return function (string, length, chars) {
                string = baseToString(string);
                return (fromRight ? string : '') + createPadding(string, length, chars) + (fromRight ? '' : string);
            };
        }
        function createPartial(flag) {
            var partialFunc = restParam(function (func, partials) {
                    var holders = replaceHolders(partials, partialFunc.placeholder);
                    return createWrapper(func, flag, null, partials, holders);
                });
            return partialFunc;
        }
        function createReduce(arrayFunc, eachFunc) {
            return function (collection, iteratee, accumulator, thisArg) {
                var initFromArray = arguments.length < 3;
                return typeof iteratee == 'function' && thisArg === undefined && isArray(collection) ? arrayFunc(collection, iteratee, accumulator, initFromArray) : baseReduce(collection, getCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
            };
        }
        function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
            var isAry = bitmask & ARY_FLAG, isBind = bitmask & BIND_FLAG, isBindKey = bitmask & BIND_KEY_FLAG, isCurry = bitmask & CURRY_FLAG, isCurryBound = bitmask & CURRY_BOUND_FLAG, isCurryRight = bitmask & CURRY_RIGHT_FLAG;
            var Ctor = !isBindKey && createCtorWrapper(func), key = func;
            function wrapper() {
                var length = arguments.length, index = length, args = Array(length);
                while (index--) {
                    args[index] = arguments[index];
                }
                if (partials) {
                    args = composeArgs(args, partials, holders);
                }
                if (partialsRight) {
                    args = composeArgsRight(args, partialsRight, holdersRight);
                }
                if (isCurry || isCurryRight) {
                    var placeholder = wrapper.placeholder, argsHolders = replaceHolders(args, placeholder);
                    length -= argsHolders.length;
                    if (length < arity) {
                        var newArgPos = argPos ? arrayCopy(argPos) : null, newArity = nativeMax(arity - length, 0), newsHolders = isCurry ? argsHolders : null, newHoldersRight = isCurry ? null : argsHolders, newPartials = isCurry ? args : null, newPartialsRight = isCurry ? null : args;
                        bitmask |= isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG;
                        bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);
                        if (!isCurryBound) {
                            bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
                        }
                        var newData = [
                                func,
                                bitmask,
                                thisArg,
                                newPartials,
                                newsHolders,
                                newPartialsRight,
                                newHoldersRight,
                                newArgPos,
                                ary,
                                newArity
                            ], result = createHybridWrapper.apply(undefined, newData);
                        if (isLaziable(func)) {
                            setData(result, newData);
                        }
                        result.placeholder = placeholder;
                        return result;
                    }
                }
                var thisBinding = isBind ? thisArg : this;
                if (isBindKey) {
                    func = thisBinding[key];
                }
                if (argPos) {
                    args = reorder(args, argPos);
                }
                if (isAry && ary < args.length) {
                    args.length = ary;
                }
                var fn = this && this !== root && this instanceof wrapper ? Ctor || createCtorWrapper(func) : func;
                return fn.apply(thisBinding, args);
            }
            return wrapper;
        }
        function createPadding(string, length, chars) {
            var strLength = string.length;
            length = +length;
            if (strLength >= length || !nativeIsFinite(length)) {
                return '';
            }
            var padLength = length - strLength;
            chars = chars == null ? ' ' : chars + '';
            return repeat(chars, ceil(padLength / chars.length)).slice(0, padLength);
        }
        function createPartialWrapper(func, bitmask, thisArg, partials) {
            var isBind = bitmask & BIND_FLAG, Ctor = createCtorWrapper(func);
            function wrapper() {
                var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(argsLength + leftLength);
                while (++leftIndex < leftLength) {
                    args[leftIndex] = partials[leftIndex];
                }
                while (argsLength--) {
                    args[leftIndex++] = arguments[++argsIndex];
                }
                var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
                return fn.apply(isBind ? thisArg : this, args);
            }
            return wrapper;
        }
        function createSortedIndex(retHighest) {
            return function (array, value, iteratee, thisArg) {
                var func = getCallback(iteratee);
                return func === baseCallback && iteratee == null ? binaryIndex(array, value, retHighest) : binaryIndexBy(array, value, func(iteratee, thisArg, 1), retHighest);
            };
        }
        function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
            var isBindKey = bitmask & BIND_KEY_FLAG;
            if (!isBindKey && typeof func != 'function') {
                throw new TypeError(FUNC_ERROR_TEXT);
            }
            var length = partials ? partials.length : 0;
            if (!length) {
                bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
                partials = holders = null;
            }
            length -= holders ? holders.length : 0;
            if (bitmask & PARTIAL_RIGHT_FLAG) {
                var partialsRight = partials, holdersRight = holders;
                partials = holders = null;
            }
            var data = isBindKey ? null : getData(func), newData = [
                    func,
                    bitmask,
                    thisArg,
                    partials,
                    holders,
                    partialsRight,
                    holdersRight,
                    argPos,
                    ary,
                    arity
                ];
            if (data) {
                mergeData(newData, data);
                bitmask = newData[1];
                arity = newData[9];
            }
            newData[9] = arity == null ? isBindKey ? 0 : func.length : nativeMax(arity - length, 0) || 0;
            if (bitmask == BIND_FLAG) {
                var result = createBindWrapper(newData[0], newData[2]);
            } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
                result = createPartialWrapper.apply(undefined, newData);
            } else {
                result = createHybridWrapper.apply(undefined, newData);
            }
            var setter = data ? baseSetData : setData;
            return setter(result, newData);
        }
        function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
            var index = -1, arrLength = array.length, othLength = other.length, result = true;
            if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
                return false;
            }
            while (result && ++index < arrLength) {
                var arrValue = array[index], othValue = other[index];
                result = undefined;
                if (customizer) {
                    result = isLoose ? customizer(othValue, arrValue, index) : customizer(arrValue, othValue, index);
                }
                if (result === undefined) {
                    if (isLoose) {
                        var othIndex = othLength;
                        while (othIndex--) {
                            othValue = other[othIndex];
                            result = arrValue && arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
                            if (result) {
                                break;
                            }
                        }
                    } else {
                        result = arrValue && arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
                    }
                }
            }
            return !!result;
        }
        function equalByTag(object, other, tag) {
            switch (tag) {
            case boolTag:
            case dateTag:
                return +object == +other;
            case errorTag:
                return object.name == other.name && object.message == other.message;
            case numberTag:
                return object != +object ? other != +other : object == +other;
            case regexpTag:
            case stringTag:
                return object == other + '';
            }
            return false;
        }
        function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
            var objProps = keys(object), objLength = objProps.length, othProps = keys(other), othLength = othProps.length;
            if (objLength != othLength && !isLoose) {
                return false;
            }
            var skipCtor = isLoose, index = -1;
            while (++index < objLength) {
                var key = objProps[index], result = isLoose ? key in other : hasOwnProperty.call(other, key);
                if (result) {
                    var objValue = object[key], othValue = other[key];
                    result = undefined;
                    if (customizer) {
                        result = isLoose ? customizer(othValue, objValue, key) : customizer(objValue, othValue, key);
                    }
                    if (result === undefined) {
                        result = objValue && objValue === othValue || equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB);
                    }
                }
                if (!result) {
                    return false;
                }
                skipCtor || (skipCtor = key == 'constructor');
            }
            if (!skipCtor) {
                var objCtor = object.constructor, othCtor = other.constructor;
                if (objCtor != othCtor && ('constructor' in object && 'constructor' in other) && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
                    return false;
                }
            }
            return true;
        }
        function extremumBy(collection, iteratee, isMin) {
            var exValue = isMin ? POSITIVE_INFINITY : NEGATIVE_INFINITY, computed = exValue, result = computed;
            baseEach(collection, function (value, index, collection) {
                var current = iteratee(value, index, collection);
                if ((isMin ? current < computed : current > computed) || current === exValue && current === result) {
                    computed = current;
                    result = value;
                }
            });
            return result;
        }
        function getCallback(func, thisArg, argCount) {
            var result = lodash.callback || callback;
            result = result === callback ? baseCallback : result;
            return argCount ? result(func, thisArg, argCount) : result;
        }
        var getData = !metaMap ? noop : function (func) {
                return metaMap.get(func);
            };
        var getFuncName = function () {
                if (!support.funcNames) {
                    return constant('');
                }
                if (constant.name == 'constant') {
                    return baseProperty('name');
                }
                return function (func) {
                    var result = func.name, array = realNames[result], length = array ? array.length : 0;
                    while (length--) {
                        var data = array[length], otherFunc = data.func;
                        if (otherFunc == null || otherFunc == func) {
                            return data.name;
                        }
                    }
                    return result;
                };
            }();
        function getIndexOf(collection, target, fromIndex) {
            var result = lodash.indexOf || indexOf;
            result = result === indexOf ? baseIndexOf : result;
            return collection ? result(collection, target, fromIndex) : result;
        }
        var getLength = baseProperty('length');
        var getSymbols = !getOwnPropertySymbols ? constant([]) : function (object) {
                return getOwnPropertySymbols(toObject(object));
            };
        function getView(start, end, transforms) {
            var index = -1, length = transforms ? transforms.length : 0;
            while (++index < length) {
                var data = transforms[index], size = data.size;
                switch (data.type) {
                case 'drop':
                    start += size;
                    break;
                case 'dropRight':
                    end -= size;
                    break;
                case 'take':
                    end = nativeMin(end, start + size);
                    break;
                case 'takeRight':
                    start = nativeMax(start, end - size);
                    break;
                }
            }
            return {
                'start': start,
                'end': end
            };
        }
        function initCloneArray(array) {
            var length = array.length, result = new array.constructor(length);
            if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
                result.index = array.index;
                result.input = array.input;
            }
            return result;
        }
        function initCloneObject(object) {
            var Ctor = object.constructor;
            if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
                Ctor = Object;
            }
            return new Ctor();
        }
        function initCloneByTag(object, tag, isDeep) {
            var Ctor = object.constructor;
            switch (tag) {
            case arrayBufferTag:
                return bufferClone(object);
            case boolTag:
            case dateTag:
                return new Ctor(+object);
            case float32Tag:
            case float64Tag:
            case int8Tag:
            case int16Tag:
            case int32Tag:
            case uint8Tag:
            case uint8ClampedTag:
            case uint16Tag:
            case uint32Tag:
                var buffer = object.buffer;
                return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);
            case numberTag:
            case stringTag:
                return new Ctor(object);
            case regexpTag:
                var result = new Ctor(object.source, reFlags.exec(object));
                result.lastIndex = object.lastIndex;
            }
            return result;
        }
        function invokePath(object, path, args) {
            if (object != null && !isKey(path, object)) {
                path = toPath(path);
                object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
                path = last(path);
            }
            var func = object == null ? object : object[path];
            return func == null ? undefined : func.apply(object, args);
        }
        function isArrayLike(value) {
            return value != null && isLength(getLength(value));
        }
        function isIndex(value, length) {
            value = +value;
            length = length == null ? MAX_SAFE_INTEGER : length;
            return value > -1 && value % 1 == 0 && value < length;
        }
        function isIterateeCall(value, index, object) {
            if (!isObject(object)) {
                return false;
            }
            var type = typeof index;
            if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
                var other = object[index];
                return value === value ? value === other : other !== other;
            }
            return false;
        }
        function isKey(value, object) {
            var type = typeof value;
            if (type == 'string' && reIsPlainProp.test(value) || type == 'number') {
                return true;
            }
            if (isArray(value)) {
                return false;
            }
            var result = !reIsDeepProp.test(value);
            return result || object != null && value in toObject(object);
        }
        function isLaziable(func) {
            var funcName = getFuncName(func);
            return !!funcName && func === lodash[funcName] && funcName in LazyWrapper.prototype;
        }
        function isLength(value) {
            return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
        }
        function isStrictComparable(value) {
            return value === value && !isObject(value);
        }
        function mergeData(data, source) {
            var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < ARY_FLAG;
            var isCombo = srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG || srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8] || srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG;
            if (!(isCommon || isCombo)) {
                return data;
            }
            if (srcBitmask & BIND_FLAG) {
                data[2] = source[2];
                newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG;
            }
            var value = source[3];
            if (value) {
                var partials = data[3];
                data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
                data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
            }
            value = source[5];
            if (value) {
                partials = data[5];
                data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
                data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
            }
            value = source[7];
            if (value) {
                data[7] = arrayCopy(value);
            }
            if (srcBitmask & ARY_FLAG) {
                data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
            }
            if (data[9] == null) {
                data[9] = source[9];
            }
            data[0] = source[0];
            data[1] = newBitmask;
            return data;
        }
        function pickByArray(object, props) {
            object = toObject(object);
            var index = -1, length = props.length, result = {};
            while (++index < length) {
                var key = props[index];
                if (key in object) {
                    result[key] = object[key];
                }
            }
            return result;
        }
        function pickByCallback(object, predicate) {
            var result = {};
            baseForIn(object, function (value, key, object) {
                if (predicate(value, key, object)) {
                    result[key] = value;
                }
            });
            return result;
        }
        function reorder(array, indexes) {
            var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = arrayCopy(array);
            while (length--) {
                var index = indexes[length];
                array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
            }
            return array;
        }
        var setData = function () {
                var count = 0, lastCalled = 0;
                return function (key, value) {
                    var stamp = now(), remaining = HOT_SPAN - (stamp - lastCalled);
                    lastCalled = stamp;
                    if (remaining > 0) {
                        if (++count >= HOT_COUNT) {
                            return key;
                        }
                    } else {
                        count = 0;
                    }
                    return baseSetData(key, value);
                };
            }();
        function shimIsPlainObject(value) {
            var Ctor, support = lodash.support;
            if (!(isObjectLike(value) && objToString.call(value) == objectTag) || !hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor))) {
                return false;
            }
            var result;
            baseForIn(value, function (subValue, key) {
                result = key;
            });
            return result === undefined || hasOwnProperty.call(value, result);
        }
        function shimKeys(object) {
            var props = keysIn(object), propsLength = props.length, length = propsLength && object.length, support = lodash.support;
            var allowIndexes = length && isLength(length) && (isArray(object) || support.nonEnumArgs && isArguments(object));
            var index = -1, result = [];
            while (++index < propsLength) {
                var key = props[index];
                if (allowIndexes && isIndex(key, length) || hasOwnProperty.call(object, key)) {
                    result.push(key);
                }
            }
            return result;
        }
        function toIterable(value) {
            if (value == null) {
                return [];
            }
            if (!isArrayLike(value)) {
                return values(value);
            }
            return isObject(value) ? value : Object(value);
        }
        function toObject(value) {
            return isObject(value) ? value : Object(value);
        }
        function toPath(value) {
            if (isArray(value)) {
                return value;
            }
            var result = [];
            baseToString(value).replace(rePropName, function (match, number, quote, string) {
                result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
            });
            return result;
        }
        function wrapperClone(wrapper) {
            return wrapper instanceof LazyWrapper ? wrapper.clone() : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__));
        }
        function chunk(array, size, guard) {
            if (guard ? isIterateeCall(array, size, guard) : size == null) {
                size = 1;
            } else {
                size = nativeMax(+size || 1, 1);
            }
            var index = 0, length = array ? array.length : 0, resIndex = -1, result = Array(ceil(length / size));
            while (index < length) {
                result[++resIndex] = baseSlice(array, index, index += size);
            }
            return result;
        }
        function compact(array) {
            var index = -1, length = array ? array.length : 0, resIndex = -1, result = [];
            while (++index < length) {
                var value = array[index];
                if (value) {
                    result[++resIndex] = value;
                }
            }
            return result;
        }
        var difference = restParam(function (array, values) {
                return isArrayLike(array) ? baseDifference(array, baseFlatten(values, false, true)) : [];
            });
        function drop(array, n, guard) {
            var length = array ? array.length : 0;
            if (!length) {
                return [];
            }
            if (guard ? isIterateeCall(array, n, guard) : n == null) {
                n = 1;
            }
            return baseSlice(array, n < 0 ? 0 : n);
        }
        function dropRight(array, n, guard) {
            var length = array ? array.length : 0;
            if (!length) {
                return [];
            }
            if (guard ? isIterateeCall(array, n, guard) : n == null) {
                n = 1;
            }
            n = length - (+n || 0);
            return baseSlice(array, 0, n < 0 ? 0 : n);
        }
        function dropRightWhile(array, predicate, thisArg) {
            return array && array.length ? baseWhile(array, getCallback(predicate, thisArg, 3), true, true) : [];
        }
        function dropWhile(array, predicate, thisArg) {
            return array && array.length ? baseWhile(array, getCallback(predicate, thisArg, 3), true) : [];
        }
        function fill(array, value, start, end) {
            var length = array ? array.length : 0;
            if (!length) {
                return [];
            }
            if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
                start = 0;
                end = length;
            }
            return baseFill(array, value, start, end);
        }
        var findIndex = createFindIndex();
        var findLastIndex = createFindIndex(true);
        function first(array) {
            return array ? array[0] : undefined;
        }
        function flatten(array, isDeep, guard) {
            var length = array ? array.length : 0;
            if (guard && isIterateeCall(array, isDeep, guard)) {
                isDeep = false;
            }
            return length ? baseFlatten(array, isDeep) : [];
        }
        function flattenDeep(array) {
            var length = array ? array.length : 0;
            return length ? baseFlatten(array, true) : [];
        }
        function indexOf(array, value, fromIndex) {
            var length = array ? array.length : 0;
            if (!length) {
                return -1;
            }
            if (typeof fromIndex == 'number') {
                fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex;
            } else if (fromIndex) {
                var index = binaryIndex(array, value), other = array[index];
                if (value === value ? value === other : other !== other) {
                    return index;
                }
                return -1;
            }
            return baseIndexOf(array, value, fromIndex || 0);
        }
        function initial(array) {
            return dropRight(array, 1);
        }
        function intersection() {
            var args = [], argsIndex = -1, argsLength = arguments.length, caches = [], indexOf = getIndexOf(), isCommon = indexOf == baseIndexOf, result = [];
            while (++argsIndex < argsLength) {
                var value = arguments[argsIndex];
                if (isArrayLike(value)) {
                    args.push(value);
                    caches.push(isCommon && value.length >= 120 ? createCache(argsIndex && value) : null);
                }
            }
            argsLength = args.length;
            if (argsLength < 2) {
                return result;
            }
            var array = args[0], index = -1, length = array ? array.length : 0, seen = caches[0];
            outer:
                while (++index < length) {
                    value = array[index];
                    if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
                        argsIndex = argsLength;
                        while (--argsIndex) {
                            var cache = caches[argsIndex];
                            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value, 0)) < 0) {
                                continue outer;
                            }
                        }
                        if (seen) {
                            seen.push(value);
                        }
                        result.push(value);
                    }
                }
            return result;
        }
        function last(array) {
            var length = array ? array.length : 0;
            return length ? array[length - 1] : undefined;
        }
        function lastIndexOf(array, value, fromIndex) {
            var length = array ? array.length : 0;
            if (!length) {
                return -1;
            }
            var index = length;
            if (typeof fromIndex == 'number') {
                index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
            } else if (fromIndex) {
                index = binaryIndex(array, value, true) - 1;
                var other = array[index];
                if (value === value ? value === other : other !== other) {
                    return index;
                }
                return -1;
            }
            if (value !== value) {
                return indexOfNaN(array, index, true);
            }
            while (index--) {
                if (array[index] === value) {
                    return index;
                }
            }
            return -1;
        }
        function pull() {
            var args = arguments, array = args[0];
            if (!(array && array.length)) {
                return array;
            }
            var index = 0, indexOf = getIndexOf(), length = args.length;
            while (++index < length) {
                var fromIndex = 0, value = args[index];
                while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
                    splice.call(array, fromIndex, 1);
                }
            }
            return array;
        }
        var pullAt = restParam(function (array, indexes) {
                indexes = baseFlatten(indexes);
                var result = baseAt(array, indexes);
                basePullAt(array, indexes.sort(baseCompareAscending));
                return result;
            });
        function remove(array, predicate, thisArg) {
            var result = [];
            if (!(array && array.length)) {
                return result;
            }
            var index = -1, indexes = [], length = array.length;
            predicate = getCallback(predicate, thisArg, 3);
            while (++index < length) {
                var value = array[index];
                if (predicate(value, index, array)) {
                    result.push(value);
                    indexes.push(index);
                }
            }
            basePullAt(array, indexes);
            return result;
        }
        function rest(array) {
            return drop(array, 1);
        }
        function slice(array, start, end) {
            var length = array ? array.length : 0;
            if (!length) {
                return [];
            }
            if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
                start = 0;
                end = length;
            }
            return baseSlice(array, start, end);
        }
        var sortedIndex = createSortedIndex();
        var sortedLastIndex = createSortedIndex(true);
        function take(array, n, guard) {
            var length = array ? array.length : 0;
            if (!length) {
                return [];
            }
            if (guard ? isIterateeCall(array, n, guard) : n == null) {
                n = 1;
            }
            return baseSlice(array, 0, n < 0 ? 0 : n);
        }
        function takeRight(array, n, guard) {
            var length = array ? array.length : 0;
            if (!length) {
                return [];
            }
            if (guard ? isIterateeCall(array, n, guard) : n == null) {
                n = 1;
            }
            n = length - (+n || 0);
            return baseSlice(array, n < 0 ? 0 : n);
        }
        function takeRightWhile(array, predicate, thisArg) {
            return array && array.length ? baseWhile(array, getCallback(predicate, thisArg, 3), false, true) : [];
        }
        function takeWhile(array, predicate, thisArg) {
            return array && array.length ? baseWhile(array, getCallback(predicate, thisArg, 3)) : [];
        }
        var union = restParam(function (arrays) {
                return baseUniq(baseFlatten(arrays, false, true));
            });
        function uniq(array, isSorted, iteratee, thisArg) {
            var length = array ? array.length : 0;
            if (!length) {
                return [];
            }
            if (isSorted != null && typeof isSorted != 'boolean') {
                thisArg = iteratee;
                iteratee = isIterateeCall(array, isSorted, thisArg) ? null : isSorted;
                isSorted = false;
            }
            var func = getCallback();
            if (!(func === baseCallback && iteratee == null)) {
                iteratee = func(iteratee, thisArg, 3);
            }
            return isSorted && getIndexOf() == baseIndexOf ? sortedUniq(array, iteratee) : baseUniq(array, iteratee);
        }
        function unzip(array) {
            if (!(array && array.length)) {
                return [];
            }
            var index = -1, length = 0;
            array = arrayFilter(array, function (group) {
                if (isArrayLike(group)) {
                    length = nativeMax(group.length, length);
                    return true;
                }
            });
            var result = Array(length);
            while (++index < length) {
                result[index] = arrayMap(array, baseProperty(index));
            }
            return result;
        }
        function unzipWith(array, iteratee, thisArg) {
            var length = array ? array.length : 0;
            if (!length) {
                return [];
            }
            var result = unzip(array);
            if (iteratee == null) {
                return result;
            }
            iteratee = bindCallback(iteratee, thisArg, 4);
            return arrayMap(result, function (group) {
                return arrayReduce(group, iteratee, undefined, true);
            });
        }
        var without = restParam(function (array, values) {
                return isArrayLike(array) ? baseDifference(array, values) : [];
            });
        function xor() {
            var index = -1, length = arguments.length;
            while (++index < length) {
                var array = arguments[index];
                if (isArrayLike(array)) {
                    var result = result ? baseDifference(result, array).concat(baseDifference(array, result)) : array;
                }
            }
            return result ? baseUniq(result) : [];
        }
        var zip = restParam(unzip);
        function zipObject(props, values) {
            var index = -1, length = props ? props.length : 0, result = {};
            if (length && !values && !isArray(props[0])) {
                values = [];
            }
            while (++index < length) {
                var key = props[index];
                if (values) {
                    result[key] = values[index];
                } else if (key) {
                    result[key[0]] = key[1];
                }
            }
            return result;
        }
        var zipWith = restParam(function (arrays) {
                var length = arrays.length, iteratee = arrays[length - 2], thisArg = arrays[length - 1];
                if (length > 2 && typeof iteratee == 'function') {
                    length -= 2;
                } else {
                    iteratee = length > 1 && typeof thisArg == 'function' ? (--length, thisArg) : undefined;
                    thisArg = undefined;
                }
                arrays.length = length;
                return unzipWith(arrays, iteratee, thisArg);
            });
        function chain(value) {
            var result = lodash(value);
            result.__chain__ = true;
            return result;
        }
        function tap(value, interceptor, thisArg) {
            interceptor.call(thisArg, value);
            return value;
        }
        function thru(value, interceptor, thisArg) {
            return interceptor.call(thisArg, value);
        }
        function wrapperChain() {
            return chain(this);
        }
        function wrapperCommit() {
            return new LodashWrapper(this.value(), this.__chain__);
        }
        function wrapperPlant(value) {
            var result, parent = this;
            while (parent instanceof baseLodash) {
                var clone = wrapperClone(parent);
                if (result) {
                    previous.__wrapped__ = clone;
                } else {
                    result = clone;
                }
                var previous = clone;
                parent = parent.__wrapped__;
            }
            previous.__wrapped__ = value;
            return result;
        }
        function wrapperReverse() {
            var value = this.__wrapped__;
            if (value instanceof LazyWrapper) {
                if (this.__actions__.length) {
                    value = new LazyWrapper(this);
                }
                return new LodashWrapper(value.reverse(), this.__chain__);
            }
            return this.thru(function (value) {
                return value.reverse();
            });
        }
        function wrapperToString() {
            return this.value() + '';
        }
        function wrapperValue() {
            return baseWrapperValue(this.__wrapped__, this.__actions__);
        }
        var at = restParam(function (collection, props) {
                return baseAt(collection, baseFlatten(props));
            });
        var countBy = createAggregator(function (result, value, key) {
                hasOwnProperty.call(result, key) ? ++result[key] : result[key] = 1;
            });
        function every(collection, predicate, thisArg) {
            var func = isArray(collection) ? arrayEvery : baseEvery;
            if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
                predicate = null;
            }
            if (typeof predicate != 'function' || thisArg !== undefined) {
                predicate = getCallback(predicate, thisArg, 3);
            }
            return func(collection, predicate);
        }
        function filter(collection, predicate, thisArg) {
            var func = isArray(collection) ? arrayFilter : baseFilter;
            predicate = getCallback(predicate, thisArg, 3);
            return func(collection, predicate);
        }
        var find = createFind(baseEach);
        var findLast = createFind(baseEachRight, true);
        function findWhere(collection, source) {
            return find(collection, baseMatches(source));
        }
        var forEach = createForEach(arrayEach, baseEach);
        var forEachRight = createForEach(arrayEachRight, baseEachRight);
        var groupBy = createAggregator(function (result, value, key) {
                if (hasOwnProperty.call(result, key)) {
                    result[key].push(value);
                } else {
                    result[key] = [value];
                }
            });
        function includes(collection, target, fromIndex, guard) {
            var length = collection ? getLength(collection) : 0;
            if (!isLength(length)) {
                collection = values(collection);
                length = collection.length;
            }
            if (!length) {
                return false;
            }
            if (typeof fromIndex != 'number' || guard && isIterateeCall(target, fromIndex, guard)) {
                fromIndex = 0;
            } else {
                fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex || 0;
            }
            return typeof collection == 'string' || !isArray(collection) && isString(collection) ? fromIndex < length && collection.indexOf(target, fromIndex) > -1 : getIndexOf(collection, target, fromIndex) > -1;
        }
        var indexBy = createAggregator(function (result, value, key) {
                result[key] = value;
            });
        var invoke = restParam(function (collection, path, args) {
                var index = -1, isFunc = typeof path == 'function', isProp = isKey(path), result = isArrayLike(collection) ? Array(collection.length) : [];
                baseEach(collection, function (value) {
                    var func = isFunc ? path : isProp && value != null && value[path];
                    result[++index] = func ? func.apply(value, args) : invokePath(value, path, args);
                });
                return result;
            });
        function map(collection, iteratee, thisArg) {
            var func = isArray(collection) ? arrayMap : baseMap;
            iteratee = getCallback(iteratee, thisArg, 3);
            return func(collection, iteratee);
        }
        var partition = createAggregator(function (result, value, key) {
                result[key ? 0 : 1].push(value);
            }, function () {
                return [
                    [],
                    []
                ];
            });
        function pluck(collection, path) {
            return map(collection, property(path));
        }
        var reduce = createReduce(arrayReduce, baseEach);
        var reduceRight = createReduce(arrayReduceRight, baseEachRight);
        function reject(collection, predicate, thisArg) {
            var func = isArray(collection) ? arrayFilter : baseFilter;
            predicate = getCallback(predicate, thisArg, 3);
            return func(collection, function (value, index, collection) {
                return !predicate(value, index, collection);
            });
        }
        function sample(collection, n, guard) {
            if (guard ? isIterateeCall(collection, n, guard) : n == null) {
                collection = toIterable(collection);
                var length = collection.length;
                return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
            }
            var result = shuffle(collection);
            result.length = nativeMin(n < 0 ? 0 : +n || 0, result.length);
            return result;
        }
        function shuffle(collection) {
            collection = toIterable(collection);
            var index = -1, length = collection.length, result = Array(length);
            while (++index < length) {
                var rand = baseRandom(0, index);
                if (index != rand) {
                    result[index] = result[rand];
                }
                result[rand] = collection[index];
            }
            return result;
        }
        function size(collection) {
            var length = collection ? getLength(collection) : 0;
            return isLength(length) ? length : keys(collection).length;
        }
        function some(collection, predicate, thisArg) {
            var func = isArray(collection) ? arraySome : baseSome;
            if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
                predicate = null;
            }
            if (typeof predicate != 'function' || thisArg !== undefined) {
                predicate = getCallback(predicate, thisArg, 3);
            }
            return func(collection, predicate);
        }
        function sortBy(collection, iteratee, thisArg) {
            if (collection == null) {
                return [];
            }
            if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
                iteratee = null;
            }
            var index = -1;
            iteratee = getCallback(iteratee, thisArg, 3);
            var result = baseMap(collection, function (value, key, collection) {
                    return {
                        'criteria': iteratee(value, key, collection),
                        'index': ++index,
                        'value': value
                    };
                });
            return baseSortBy(result, compareAscending);
        }
        var sortByAll = restParam(function (collection, iteratees) {
                if (collection == null) {
                    return [];
                }
                var guard = iteratees[2];
                if (guard && isIterateeCall(iteratees[0], iteratees[1], guard)) {
                    iteratees.length = 1;
                }
                return baseSortByOrder(collection, baseFlatten(iteratees), []);
            });
        function sortByOrder(collection, iteratees, orders, guard) {
            if (collection == null) {
                return [];
            }
            if (guard && isIterateeCall(iteratees, orders, guard)) {
                orders = null;
            }
            if (!isArray(iteratees)) {
                iteratees = iteratees == null ? [] : [iteratees];
            }
            if (!isArray(orders)) {
                orders = orders == null ? [] : [orders];
            }
            return baseSortByOrder(collection, iteratees, orders);
        }
        function where(collection, source) {
            return filter(collection, baseMatches(source));
        }
        var now = nativeNow || function () {
                return new Date().getTime();
            };
        function after(n, func) {
            if (typeof func != 'function') {
                if (typeof n == 'function') {
                    var temp = n;
                    n = func;
                    func = temp;
                } else {
                    throw new TypeError(FUNC_ERROR_TEXT);
                }
            }
            n = nativeIsFinite(n = +n) ? n : 0;
            return function () {
                if (--n < 1) {
                    return func.apply(this, arguments);
                }
            };
        }
        function ary(func, n, guard) {
            if (guard && isIterateeCall(func, n, guard)) {
                n = null;
            }
            n = func && n == null ? func.length : nativeMax(+n || 0, 0);
            return createWrapper(func, ARY_FLAG, null, null, null, null, n);
        }
        function before(n, func) {
            var result;
            if (typeof func != 'function') {
                if (typeof n == 'function') {
                    var temp = n;
                    n = func;
                    func = temp;
                } else {
                    throw new TypeError(FUNC_ERROR_TEXT);
                }
            }
            return function () {
                if (--n > 0) {
                    result = func.apply(this, arguments);
                }
                if (n <= 1) {
                    func = null;
                }
                return result;
            };
        }
        var bind = restParam(function (func, thisArg, partials) {
                var bitmask = BIND_FLAG;
                if (partials.length) {
                    var holders = replaceHolders(partials, bind.placeholder);
                    bitmask |= PARTIAL_FLAG;
                }
                return createWrapper(func, bitmask, thisArg, partials, holders);
            });
        var bindAll = restParam(function (object, methodNames) {
                methodNames = methodNames.length ? baseFlatten(methodNames) : functions(object);
                var index = -1, length = methodNames.length;
                while (++index < length) {
                    var key = methodNames[index];
                    object[key] = createWrapper(object[key], BIND_FLAG, object);
                }
                return object;
            });
        var bindKey = restParam(function (object, key, partials) {
                var bitmask = BIND_FLAG | BIND_KEY_FLAG;
                if (partials.length) {
                    var holders = replaceHolders(partials, bindKey.placeholder);
                    bitmask |= PARTIAL_FLAG;
                }
                return createWrapper(key, bitmask, object, partials, holders);
            });
        var curry = createCurry(CURRY_FLAG);
        var curryRight = createCurry(CURRY_RIGHT_FLAG);
        function debounce(func, wait, options) {
            var args, maxTimeoutId, result, stamp, thisArg, timeoutId, trailingCall, lastCalled = 0, maxWait = false, trailing = true;
            if (typeof func != 'function') {
                throw new TypeError(FUNC_ERROR_TEXT);
            }
            wait = wait < 0 ? 0 : +wait || 0;
            if (options === true) {
                var leading = true;
                trailing = false;
            } else if (isObject(options)) {
                leading = options.leading;
                maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
                trailing = 'trailing' in options ? options.trailing : trailing;
            }
            function cancel() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                if (maxTimeoutId) {
                    clearTimeout(maxTimeoutId);
                }
                maxTimeoutId = timeoutId = trailingCall = undefined;
            }
            function delayed() {
                var remaining = wait - (now() - stamp);
                if (remaining <= 0 || remaining > wait) {
                    if (maxTimeoutId) {
                        clearTimeout(maxTimeoutId);
                    }
                    var isCalled = trailingCall;
                    maxTimeoutId = timeoutId = trailingCall = undefined;
                    if (isCalled) {
                        lastCalled = now();
                        result = func.apply(thisArg, args);
                        if (!timeoutId && !maxTimeoutId) {
                            args = thisArg = null;
                        }
                    }
                } else {
                    timeoutId = setTimeout(delayed, remaining);
                }
            }
            function maxDelayed() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                maxTimeoutId = timeoutId = trailingCall = undefined;
                if (trailing || maxWait !== wait) {
                    lastCalled = now();
                    result = func.apply(thisArg, args);
                    if (!timeoutId && !maxTimeoutId) {
                        args = thisArg = null;
                    }
                }
            }
            function debounced() {
                args = arguments;
                stamp = now();
                thisArg = this;
                trailingCall = trailing && (timeoutId || !leading);
                if (maxWait === false) {
                    var leadingCall = leading && !timeoutId;
                } else {
                    if (!maxTimeoutId && !leading) {
                        lastCalled = stamp;
                    }
                    var remaining = maxWait - (stamp - lastCalled), isCalled = remaining <= 0 || remaining > maxWait;
                    if (isCalled) {
                        if (maxTimeoutId) {
                            maxTimeoutId = clearTimeout(maxTimeoutId);
                        }
                        lastCalled = stamp;
                        result = func.apply(thisArg, args);
                    } else if (!maxTimeoutId) {
                        maxTimeoutId = setTimeout(maxDelayed, remaining);
                    }
                }
                if (isCalled && timeoutId) {
                    timeoutId = clearTimeout(timeoutId);
                } else if (!timeoutId && wait !== maxWait) {
                    timeoutId = setTimeout(delayed, wait);
                }
                if (leadingCall) {
                    isCalled = true;
                    result = func.apply(thisArg, args);
                }
                if (isCalled && !timeoutId && !maxTimeoutId) {
                    args = thisArg = null;
                }
                return result;
            }
            debounced.cancel = cancel;
            return debounced;
        }
        var defer = restParam(function (func, args) {
                return baseDelay(func, 1, args);
            });
        var delay = restParam(function (func, wait, args) {
                return baseDelay(func, wait, args);
            });
        var flow = createFlow();
        var flowRight = createFlow(true);
        function memoize(func, resolver) {
            if (typeof func != 'function' || resolver && typeof resolver != 'function') {
                throw new TypeError(FUNC_ERROR_TEXT);
            }
            var memoized = function () {
                var args = arguments, cache = memoized.cache, key = resolver ? resolver.apply(this, args) : args[0];
                if (cache.has(key)) {
                    return cache.get(key);
                }
                var result = func.apply(this, args);
                cache.set(key, result);
                return result;
            };
            memoized.cache = new memoize.Cache();
            return memoized;
        }
        function negate(predicate) {
            if (typeof predicate != 'function') {
                throw new TypeError(FUNC_ERROR_TEXT);
            }
            return function () {
                return !predicate.apply(this, arguments);
            };
        }
        function once(func) {
            return before(2, func);
        }
        var partial = createPartial(PARTIAL_FLAG);
        var partialRight = createPartial(PARTIAL_RIGHT_FLAG);
        var rearg = restParam(function (func, indexes) {
                return createWrapper(func, REARG_FLAG, null, null, null, baseFlatten(indexes));
            });
        function restParam(func, start) {
            if (typeof func != 'function') {
                throw new TypeError(FUNC_ERROR_TEXT);
            }
            start = nativeMax(start === undefined ? func.length - 1 : +start || 0, 0);
            return function () {
                var args = arguments, index = -1, length = nativeMax(args.length - start, 0), rest = Array(length);
                while (++index < length) {
                    rest[index] = args[start + index];
                }
                switch (start) {
                case 0:
                    return func.call(this, rest);
                case 1:
                    return func.call(this, args[0], rest);
                case 2:
                    return func.call(this, args[0], args[1], rest);
                }
                var otherArgs = Array(start + 1);
                index = -1;
                while (++index < start) {
                    otherArgs[index] = args[index];
                }
                otherArgs[start] = rest;
                return func.apply(this, otherArgs);
            };
        }
        function spread(func) {
            if (typeof func != 'function') {
                throw new TypeError(FUNC_ERROR_TEXT);
            }
            return function (array) {
                return func.apply(this, array);
            };
        }
        function throttle(func, wait, options) {
            var leading = true, trailing = true;
            if (typeof func != 'function') {
                throw new TypeError(FUNC_ERROR_TEXT);
            }
            if (options === false) {
                leading = false;
            } else if (isObject(options)) {
                leading = 'leading' in options ? !!options.leading : leading;
                trailing = 'trailing' in options ? !!options.trailing : trailing;
            }
            debounceOptions.leading = leading;
            debounceOptions.maxWait = +wait;
            debounceOptions.trailing = trailing;
            return debounce(func, wait, debounceOptions);
        }
        function wrap(value, wrapper) {
            wrapper = wrapper == null ? identity : wrapper;
            return createWrapper(wrapper, PARTIAL_FLAG, null, [value], []);
        }
        function clone(value, isDeep, customizer, thisArg) {
            if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
                isDeep = false;
            } else if (typeof isDeep == 'function') {
                thisArg = customizer;
                customizer = isDeep;
                isDeep = false;
            }
            customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
            return baseClone(value, isDeep, customizer);
        }
        function cloneDeep(value, customizer, thisArg) {
            customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
            return baseClone(value, true, customizer);
        }
        function isArguments(value) {
            return isObjectLike(value) && isArrayLike(value) && objToString.call(value) == argsTag;
        }
        var isArray = nativeIsArray || function (value) {
                return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
            };
        function isBoolean(value) {
            return value === true || value === false || isObjectLike(value) && objToString.call(value) == boolTag;
        }
        function isDate(value) {
            return isObjectLike(value) && objToString.call(value) == dateTag;
        }
        function isElement(value) {
            return !!value && value.nodeType === 1 && isObjectLike(value) && objToString.call(value).indexOf('Element') > -1;
        }
        if (!support.dom) {
            isElement = function (value) {
                return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
            };
        }
        function isEmpty(value) {
            if (value == null) {
                return true;
            }
            if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) || isObjectLike(value) && isFunction(value.splice))) {
                return !value.length;
            }
            return !keys(value).length;
        }
        function isEqual(value, other, customizer, thisArg) {
            customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
            if (!customizer && isStrictComparable(value) && isStrictComparable(other)) {
                return value === other;
            }
            var result = customizer ? customizer(value, other) : undefined;
            return result === undefined ? baseIsEqual(value, other, customizer) : !!result;
        }
        function isError(value) {
            return isObjectLike(value) && typeof value.message == 'string' && objToString.call(value) == errorTag;
        }
        var isFinite = nativeNumIsFinite || function (value) {
                return typeof value == 'number' && nativeIsFinite(value);
            };
        var isFunction = !(baseIsFunction(/x/) || Uint8Array && !baseIsFunction(Uint8Array)) ? baseIsFunction : function (value) {
                return objToString.call(value) == funcTag;
            };
        function isObject(value) {
            var type = typeof value;
            return type == 'function' || !!value && type == 'object';
        }
        function isMatch(object, source, customizer, thisArg) {
            var props = keys(source), length = props.length;
            if (!length) {
                return true;
            }
            if (object == null) {
                return false;
            }
            customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
            object = toObject(object);
            if (!customizer && length == 1) {
                var key = props[0], value = source[key];
                if (isStrictComparable(value)) {
                    return value === object[key] && (value !== undefined || key in object);
                }
            }
            var values = Array(length), strictCompareFlags = Array(length);
            while (length--) {
                value = values[length] = source[props[length]];
                strictCompareFlags[length] = isStrictComparable(value);
            }
            return baseIsMatch(object, props, values, strictCompareFlags, customizer);
        }
        function isNaN(value) {
            return isNumber(value) && value != +value;
        }
        function isNative(value) {
            if (value == null) {
                return false;
            }
            if (objToString.call(value) == funcTag) {
                return reIsNative.test(fnToString.call(value));
            }
            return isObjectLike(value) && reIsHostCtor.test(value);
        }
        function isNull(value) {
            return value === null;
        }
        function isNumber(value) {
            return typeof value == 'number' || isObjectLike(value) && objToString.call(value) == numberTag;
        }
        var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function (value) {
                if (!(value && objToString.call(value) == objectTag)) {
                    return false;
                }
                var valueOf = value.valueOf, objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);
                return objProto ? value == objProto || getPrototypeOf(value) == objProto : shimIsPlainObject(value);
            };
        function isRegExp(value) {
            return isObjectLike(value) && objToString.call(value) == regexpTag;
        }
        function isString(value) {
            return typeof value == 'string' || isObjectLike(value) && objToString.call(value) == stringTag;
        }
        function isTypedArray(value) {
            return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
        }
        function isUndefined(value) {
            return value === undefined;
        }
        function toArray(value) {
            var length = value ? getLength(value) : 0;
            if (!isLength(length)) {
                return values(value);
            }
            if (!length) {
                return [];
            }
            return arrayCopy(value);
        }
        function toPlainObject(value) {
            return baseCopy(value, keysIn(value));
        }
        var assign = createAssigner(function (object, source, customizer) {
                return customizer ? assignWith(object, source, customizer) : baseAssign(object, source);
            });
        function create(prototype, properties, guard) {
            var result = baseCreate(prototype);
            if (guard && isIterateeCall(prototype, properties, guard)) {
                properties = null;
            }
            return properties ? baseAssign(result, properties) : result;
        }
        var defaults = restParam(function (args) {
                var object = args[0];
                if (object == null) {
                    return object;
                }
                args.push(assignDefaults);
                return assign.apply(undefined, args);
            });
        var findKey = createFindKey(baseForOwn);
        var findLastKey = createFindKey(baseForOwnRight);
        var forIn = createForIn(baseFor);
        var forInRight = createForIn(baseForRight);
        var forOwn = createForOwn(baseForOwn);
        var forOwnRight = createForOwn(baseForOwnRight);
        function functions(object) {
            return baseFunctions(object, keysIn(object));
        }
        function get(object, path, defaultValue) {
            var result = object == null ? undefined : baseGet(object, toPath(path), path + '');
            return result === undefined ? defaultValue : result;
        }
        function has(object, path) {
            if (object == null) {
                return false;
            }
            var result = hasOwnProperty.call(object, path);
            if (!result && !isKey(path)) {
                path = toPath(path);
                object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
                path = last(path);
                result = object != null && hasOwnProperty.call(object, path);
            }
            return result;
        }
        function invert(object, multiValue, guard) {
            if (guard && isIterateeCall(object, multiValue, guard)) {
                multiValue = null;
            }
            var index = -1, props = keys(object), length = props.length, result = {};
            while (++index < length) {
                var key = props[index], value = object[key];
                if (multiValue) {
                    if (hasOwnProperty.call(result, value)) {
                        result[value].push(key);
                    } else {
                        result[value] = [key];
                    }
                } else {
                    result[value] = key;
                }
            }
            return result;
        }
        var keys = !nativeKeys ? shimKeys : function (object) {
                var Ctor = object != null && object.constructor;
                if (typeof Ctor == 'function' && Ctor.prototype === object || typeof object != 'function' && isArrayLike(object)) {
                    return shimKeys(object);
                }
                return isObject(object) ? nativeKeys(object) : [];
            };
        function keysIn(object) {
            if (object == null) {
                return [];
            }
            if (!isObject(object)) {
                object = Object(object);
            }
            var length = object.length;
            length = length && isLength(length) && (isArray(object) || support.nonEnumArgs && isArguments(object)) && length || 0;
            var Ctor = object.constructor, index = -1, isProto = typeof Ctor == 'function' && Ctor.prototype === object, result = Array(length), skipIndexes = length > 0;
            while (++index < length) {
                result[index] = index + '';
            }
            for (var key in object) {
                if (!(skipIndexes && isIndex(key, length)) && !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
                    result.push(key);
                }
            }
            return result;
        }
        var mapKeys = createObjectMapper(true);
        var mapValues = createObjectMapper();
        var merge = createAssigner(baseMerge);
        var omit = restParam(function (object, props) {
                if (object == null) {
                    return {};
                }
                if (typeof props[0] != 'function') {
                    var props = arrayMap(baseFlatten(props), String);
                    return pickByArray(object, baseDifference(keysIn(object), props));
                }
                var predicate = bindCallback(props[0], props[1], 3);
                return pickByCallback(object, function (value, key, object) {
                    return !predicate(value, key, object);
                });
            });
        function pairs(object) {
            var index = -1, props = keys(object), length = props.length, result = Array(length);
            while (++index < length) {
                var key = props[index];
                result[index] = [
                    key,
                    object[key]
                ];
            }
            return result;
        }
        var pick = restParam(function (object, props) {
                if (object == null) {
                    return {};
                }
                return typeof props[0] == 'function' ? pickByCallback(object, bindCallback(props[0], props[1], 3)) : pickByArray(object, baseFlatten(props));
            });
        function result(object, path, defaultValue) {
            var result = object == null ? undefined : object[path];
            if (result === undefined) {
                if (object != null && !isKey(path, object)) {
                    path = toPath(path);
                    object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
                    result = object == null ? undefined : object[last(path)];
                }
                result = result === undefined ? defaultValue : result;
            }
            return isFunction(result) ? result.call(object) : result;
        }
        function set(object, path, value) {
            if (object == null) {
                return object;
            }
            var pathKey = path + '';
            path = object[pathKey] != null || isKey(path, object) ? [pathKey] : toPath(path);
            var index = -1, length = path.length, endIndex = length - 1, nested = object;
            while (nested != null && ++index < length) {
                var key = path[index];
                if (isObject(nested)) {
                    if (index == endIndex) {
                        nested[key] = value;
                    } else if (nested[key] == null) {
                        nested[key] = isIndex(path[index + 1]) ? [] : {};
                    }
                }
                nested = nested[key];
            }
            return object;
        }
        function transform(object, iteratee, accumulator, thisArg) {
            var isArr = isArray(object) || isTypedArray(object);
            iteratee = getCallback(iteratee, thisArg, 4);
            if (accumulator == null) {
                if (isArr || isObject(object)) {
                    var Ctor = object.constructor;
                    if (isArr) {
                        accumulator = isArray(object) ? new Ctor() : [];
                    } else {
                        accumulator = baseCreate(isFunction(Ctor) && Ctor.prototype);
                    }
                } else {
                    accumulator = {};
                }
            }
            (isArr ? arrayEach : baseForOwn)(object, function (value, index, object) {
                return iteratee(accumulator, value, index, object);
            });
            return accumulator;
        }
        function values(object) {
            return baseValues(object, keys(object));
        }
        function valuesIn(object) {
            return baseValues(object, keysIn(object));
        }
        function inRange(value, start, end) {
            start = +start || 0;
            if (typeof end === 'undefined') {
                end = start;
                start = 0;
            } else {
                end = +end || 0;
            }
            return value >= nativeMin(start, end) && value < nativeMax(start, end);
        }
        function random(min, max, floating) {
            if (floating && isIterateeCall(min, max, floating)) {
                max = floating = null;
            }
            var noMin = min == null, noMax = max == null;
            if (floating == null) {
                if (noMax && typeof min == 'boolean') {
                    floating = min;
                    min = 1;
                } else if (typeof max == 'boolean') {
                    floating = max;
                    noMax = true;
                }
            }
            if (noMin && noMax) {
                max = 1;
                noMax = false;
            }
            min = +min || 0;
            if (noMax) {
                max = min;
                min = 0;
            } else {
                max = +max || 0;
            }
            if (floating || min % 1 || max % 1) {
                var rand = nativeRandom();
                return nativeMin(min + rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1))), max);
            }
            return baseRandom(min, max);
        }
        var camelCase = createCompounder(function (result, word, index) {
                word = word.toLowerCase();
                return result + (index ? word.charAt(0).toUpperCase() + word.slice(1) : word);
            });
        function capitalize(string) {
            string = baseToString(string);
            return string && string.charAt(0).toUpperCase() + string.slice(1);
        }
        function deburr(string) {
            string = baseToString(string);
            return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
        }
        function endsWith(string, target, position) {
            string = baseToString(string);
            target = target + '';
            var length = string.length;
            position = position === undefined ? length : nativeMin(position < 0 ? 0 : +position || 0, length);
            position -= target.length;
            return position >= 0 && string.indexOf(target, position) == position;
        }
        function escape(string) {
            string = baseToString(string);
            return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
        }
        function escapeRegExp(string) {
            string = baseToString(string);
            return string && reHasRegExpChars.test(string) ? string.replace(reRegExpChars, '\\$&') : string;
        }
        var kebabCase = createCompounder(function (result, word, index) {
                return result + (index ? '-' : '') + word.toLowerCase();
            });
        function pad(string, length, chars) {
            string = baseToString(string);
            length = +length;
            var strLength = string.length;
            if (strLength >= length || !nativeIsFinite(length)) {
                return string;
            }
            var mid = (length - strLength) / 2, leftLength = floor(mid), rightLength = ceil(mid);
            chars = createPadding('', rightLength, chars);
            return chars.slice(0, leftLength) + string + chars;
        }
        var padLeft = createPadDir();
        var padRight = createPadDir(true);
        function parseInt(string, radix, guard) {
            if (guard && isIterateeCall(string, radix, guard)) {
                radix = 0;
            }
            return nativeParseInt(string, radix);
        }
        if (nativeParseInt(whitespace + '08') != 8) {
            parseInt = function (string, radix, guard) {
                if (guard ? isIterateeCall(string, radix, guard) : radix == null) {
                    radix = 0;
                } else if (radix) {
                    radix = +radix;
                }
                string = trim(string);
                return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
            };
        }
        function repeat(string, n) {
            var result = '';
            string = baseToString(string);
            n = +n;
            if (n < 1 || !string || !nativeIsFinite(n)) {
                return result;
            }
            do {
                if (n % 2) {
                    result += string;
                }
                n = floor(n / 2);
                string += string;
            } while (n);
            return result;
        }
        var snakeCase = createCompounder(function (result, word, index) {
                return result + (index ? '_' : '') + word.toLowerCase();
            });
        var startCase = createCompounder(function (result, word, index) {
                return result + (index ? ' ' : '') + (word.charAt(0).toUpperCase() + word.slice(1));
            });
        function startsWith(string, target, position) {
            string = baseToString(string);
            position = position == null ? 0 : nativeMin(position < 0 ? 0 : +position || 0, string.length);
            return string.lastIndexOf(target, position) == position;
        }
        function template(string, options, otherOptions) {
            var settings = lodash.templateSettings;
            if (otherOptions && isIterateeCall(string, options, otherOptions)) {
                options = otherOptions = null;
            }
            string = baseToString(string);
            options = assignWith(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);
            var imports = assignWith(baseAssign({}, options.imports), settings.imports, assignOwnDefaults), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
            var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = '__p += \'';
            var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
            var sourceURL = '//# sourceURL=' + ('sourceURL' in options ? options.sourceURL : 'lodash.templateSources[' + ++templateCounter + ']') + '\n';
            string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
                interpolateValue || (interpolateValue = esTemplateValue);
                source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
                if (escapeValue) {
                    isEscaping = true;
                    source += '\' +\n__e(' + escapeValue + ') +\n\'';
                }
                if (evaluateValue) {
                    isEvaluating = true;
                    source += '\';\n' + evaluateValue + ';\n__p += \'';
                }
                if (interpolateValue) {
                    source += '\' +\n((__t = (' + interpolateValue + ')) == null ? \'\' : __t) +\n\'';
                }
                index = offset + match.length;
                return match;
            });
            source += '\';\n';
            var variable = options.variable;
            if (!variable) {
                source = 'with (obj) {\n' + source + '\n}\n';
            }
            source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');
            source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '' : 'obj || (obj = {});\n') + 'var __t, __p = \'\'' + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + 'function print() { __p += __j.call(arguments, \'\') }\n' : ';\n') + source + 'return __p\n}';
            var result = attempt(function () {
                    return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
                });
            result.source = source;
            if (isError(result)) {
                throw result;
            }
            return result;
        }
        function trim(string, chars, guard) {
            var value = string;
            string = baseToString(string);
            if (!string) {
                return string;
            }
            if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
                return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
            }
            chars = chars + '';
            return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
        }
        function trimLeft(string, chars, guard) {
            var value = string;
            string = baseToString(string);
            if (!string) {
                return string;
            }
            if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
                return string.slice(trimmedLeftIndex(string));
            }
            return string.slice(charsLeftIndex(string, chars + ''));
        }
        function trimRight(string, chars, guard) {
            var value = string;
            string = baseToString(string);
            if (!string) {
                return string;
            }
            if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
                return string.slice(0, trimmedRightIndex(string) + 1);
            }
            return string.slice(0, charsRightIndex(string, chars + '') + 1);
        }
        function trunc(string, options, guard) {
            if (guard && isIterateeCall(string, options, guard)) {
                options = null;
            }
            var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
            if (options != null) {
                if (isObject(options)) {
                    var separator = 'separator' in options ? options.separator : separator;
                    length = 'length' in options ? +options.length || 0 : length;
                    omission = 'omission' in options ? baseToString(options.omission) : omission;
                } else {
                    length = +options || 0;
                }
            }
            string = baseToString(string);
            if (length >= string.length) {
                return string;
            }
            var end = length - omission.length;
            if (end < 1) {
                return omission;
            }
            var result = string.slice(0, end);
            if (separator == null) {
                return result + omission;
            }
            if (isRegExp(separator)) {
                if (string.slice(end).search(separator)) {
                    var match, newEnd, substring = string.slice(0, end);
                    if (!separator.global) {
                        separator = RegExp(separator.source, (reFlags.exec(separator) || '') + 'g');
                    }
                    separator.lastIndex = 0;
                    while (match = separator.exec(substring)) {
                        newEnd = match.index;
                    }
                    result = result.slice(0, newEnd == null ? end : newEnd);
                }
            } else if (string.indexOf(separator, end) != end) {
                var index = result.lastIndexOf(separator);
                if (index > -1) {
                    result = result.slice(0, index);
                }
            }
            return result + omission;
        }
        function unescape(string) {
            string = baseToString(string);
            return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
        }
        function words(string, pattern, guard) {
            if (guard && isIterateeCall(string, pattern, guard)) {
                pattern = null;
            }
            string = baseToString(string);
            return string.match(pattern || reWords) || [];
        }
        var attempt = restParam(function (func, args) {
                try {
                    return func.apply(undefined, args);
                } catch (e) {
                    return isError(e) ? e : new Error(e);
                }
            });
        function callback(func, thisArg, guard) {
            if (guard && isIterateeCall(func, thisArg, guard)) {
                thisArg = null;
            }
            return isObjectLike(func) ? matches(func) : baseCallback(func, thisArg);
        }
        function constant(value) {
            return function () {
                return value;
            };
        }
        function identity(value) {
            return value;
        }
        function matches(source) {
            return baseMatches(baseClone(source, true));
        }
        function matchesProperty(path, value) {
            return baseMatchesProperty(path, baseClone(value, true));
        }
        var method = restParam(function (path, args) {
                return function (object) {
                    return invokePath(object, path, args);
                };
            });
        var methodOf = restParam(function (object, args) {
                return function (path) {
                    return invokePath(object, path, args);
                };
            });
        function mixin(object, source, options) {
            if (options == null) {
                var isObj = isObject(source), props = isObj && keys(source), methodNames = props && props.length && baseFunctions(source, props);
                if (!(methodNames ? methodNames.length : isObj)) {
                    methodNames = false;
                    options = source;
                    source = object;
                    object = this;
                }
            }
            if (!methodNames) {
                methodNames = baseFunctions(source, keys(source));
            }
            var chain = true, index = -1, isFunc = isFunction(object), length = methodNames.length;
            if (options === false) {
                chain = false;
            } else if (isObject(options) && 'chain' in options) {
                chain = options.chain;
            }
            while (++index < length) {
                var methodName = methodNames[index], func = source[methodName];
                object[methodName] = func;
                if (isFunc) {
                    object.prototype[methodName] = function (func) {
                        return function () {
                            var chainAll = this.__chain__;
                            if (chain || chainAll) {
                                var result = object(this.__wrapped__), actions = result.__actions__ = arrayCopy(this.__actions__);
                                actions.push({
                                    'func': func,
                                    'args': arguments,
                                    'thisArg': object
                                });
                                result.__chain__ = chainAll;
                                return result;
                            }
                            var args = [this.value()];
                            push.apply(args, arguments);
                            return func.apply(object, args);
                        };
                    }(func);
                }
            }
            return object;
        }
        function noConflict() {
            context._ = oldDash;
            return this;
        }
        function noop() {
        }
        function property(path) {
            return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
        }
        function propertyOf(object) {
            return function (path) {
                return baseGet(object, toPath(path), path + '');
            };
        }
        function range(start, end, step) {
            if (step && isIterateeCall(start, end, step)) {
                end = step = null;
            }
            start = +start || 0;
            step = step == null ? 1 : +step || 0;
            if (end == null) {
                end = start;
                start = 0;
            } else {
                end = +end || 0;
            }
            var index = -1, length = nativeMax(ceil((end - start) / (step || 1)), 0), result = Array(length);
            while (++index < length) {
                result[index] = start;
                start += step;
            }
            return result;
        }
        function times(n, iteratee, thisArg) {
            n = floor(n);
            if (n < 1 || !nativeIsFinite(n)) {
                return [];
            }
            var index = -1, result = Array(nativeMin(n, MAX_ARRAY_LENGTH));
            iteratee = bindCallback(iteratee, thisArg, 1);
            while (++index < n) {
                if (index < MAX_ARRAY_LENGTH) {
                    result[index] = iteratee(index);
                } else {
                    iteratee(index);
                }
            }
            return result;
        }
        function uniqueId(prefix) {
            var id = ++idCounter;
            return baseToString(prefix) + id;
        }
        function add(augend, addend) {
            return (+augend || 0) + (+addend || 0);
        }
        var max = createExtremum(arrayMax);
        var min = createExtremum(arrayMin, true);
        function sum(collection, iteratee, thisArg) {
            if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
                iteratee = null;
            }
            var func = getCallback(), noIteratee = iteratee == null;
            if (!(func === baseCallback && noIteratee)) {
                noIteratee = false;
                iteratee = func(iteratee, thisArg, 3);
            }
            return noIteratee ? arraySum(isArray(collection) ? collection : toIterable(collection)) : baseSum(collection, iteratee);
        }
        lodash.prototype = baseLodash.prototype;
        LodashWrapper.prototype = baseCreate(baseLodash.prototype);
        LodashWrapper.prototype.constructor = LodashWrapper;
        LazyWrapper.prototype = baseCreate(baseLodash.prototype);
        LazyWrapper.prototype.constructor = LazyWrapper;
        MapCache.prototype['delete'] = mapDelete;
        MapCache.prototype.get = mapGet;
        MapCache.prototype.has = mapHas;
        MapCache.prototype.set = mapSet;
        SetCache.prototype.push = cachePush;
        memoize.Cache = MapCache;
        lodash.after = after;
        lodash.ary = ary;
        lodash.assign = assign;
        lodash.at = at;
        lodash.before = before;
        lodash.bind = bind;
        lodash.bindAll = bindAll;
        lodash.bindKey = bindKey;
        lodash.callback = callback;
        lodash.chain = chain;
        lodash.chunk = chunk;
        lodash.compact = compact;
        lodash.constant = constant;
        lodash.countBy = countBy;
        lodash.create = create;
        lodash.curry = curry;
        lodash.curryRight = curryRight;
        lodash.debounce = debounce;
        lodash.defaults = defaults;
        lodash.defer = defer;
        lodash.delay = delay;
        lodash.difference = difference;
        lodash.drop = drop;
        lodash.dropRight = dropRight;
        lodash.dropRightWhile = dropRightWhile;
        lodash.dropWhile = dropWhile;
        lodash.fill = fill;
        lodash.filter = filter;
        lodash.flatten = flatten;
        lodash.flattenDeep = flattenDeep;
        lodash.flow = flow;
        lodash.flowRight = flowRight;
        lodash.forEach = forEach;
        lodash.forEachRight = forEachRight;
        lodash.forIn = forIn;
        lodash.forInRight = forInRight;
        lodash.forOwn = forOwn;
        lodash.forOwnRight = forOwnRight;
        lodash.functions = functions;
        lodash.groupBy = groupBy;
        lodash.indexBy = indexBy;
        lodash.initial = initial;
        lodash.intersection = intersection;
        lodash.invert = invert;
        lodash.invoke = invoke;
        lodash.keys = keys;
        lodash.keysIn = keysIn;
        lodash.map = map;
        lodash.mapKeys = mapKeys;
        lodash.mapValues = mapValues;
        lodash.matches = matches;
        lodash.matchesProperty = matchesProperty;
        lodash.memoize = memoize;
        lodash.merge = merge;
        lodash.method = method;
        lodash.methodOf = methodOf;
        lodash.mixin = mixin;
        lodash.negate = negate;
        lodash.omit = omit;
        lodash.once = once;
        lodash.pairs = pairs;
        lodash.partial = partial;
        lodash.partialRight = partialRight;
        lodash.partition = partition;
        lodash.pick = pick;
        lodash.pluck = pluck;
        lodash.property = property;
        lodash.propertyOf = propertyOf;
        lodash.pull = pull;
        lodash.pullAt = pullAt;
        lodash.range = range;
        lodash.rearg = rearg;
        lodash.reject = reject;
        lodash.remove = remove;
        lodash.rest = rest;
        lodash.restParam = restParam;
        lodash.set = set;
        lodash.shuffle = shuffle;
        lodash.slice = slice;
        lodash.sortBy = sortBy;
        lodash.sortByAll = sortByAll;
        lodash.sortByOrder = sortByOrder;
        lodash.spread = spread;
        lodash.take = take;
        lodash.takeRight = takeRight;
        lodash.takeRightWhile = takeRightWhile;
        lodash.takeWhile = takeWhile;
        lodash.tap = tap;
        lodash.throttle = throttle;
        lodash.thru = thru;
        lodash.times = times;
        lodash.toArray = toArray;
        lodash.toPlainObject = toPlainObject;
        lodash.transform = transform;
        lodash.union = union;
        lodash.uniq = uniq;
        lodash.unzip = unzip;
        lodash.unzipWith = unzipWith;
        lodash.values = values;
        lodash.valuesIn = valuesIn;
        lodash.where = where;
        lodash.without = without;
        lodash.wrap = wrap;
        lodash.xor = xor;
        lodash.zip = zip;
        lodash.zipObject = zipObject;
        lodash.zipWith = zipWith;
        lodash.backflow = flowRight;
        lodash.collect = map;
        lodash.compose = flowRight;
        lodash.each = forEach;
        lodash.eachRight = forEachRight;
        lodash.extend = assign;
        lodash.iteratee = callback;
        lodash.methods = functions;
        lodash.object = zipObject;
        lodash.select = filter;
        lodash.tail = rest;
        lodash.unique = uniq;
        mixin(lodash, lodash);
        lodash.add = add;
        lodash.attempt = attempt;
        lodash.camelCase = camelCase;
        lodash.capitalize = capitalize;
        lodash.clone = clone;
        lodash.cloneDeep = cloneDeep;
        lodash.deburr = deburr;
        lodash.endsWith = endsWith;
        lodash.escape = escape;
        lodash.escapeRegExp = escapeRegExp;
        lodash.every = every;
        lodash.find = find;
        lodash.findIndex = findIndex;
        lodash.findKey = findKey;
        lodash.findLast = findLast;
        lodash.findLastIndex = findLastIndex;
        lodash.findLastKey = findLastKey;
        lodash.findWhere = findWhere;
        lodash.first = first;
        lodash.get = get;
        lodash.has = has;
        lodash.identity = identity;
        lodash.includes = includes;
        lodash.indexOf = indexOf;
        lodash.inRange = inRange;
        lodash.isArguments = isArguments;
        lodash.isArray = isArray;
        lodash.isBoolean = isBoolean;
        lodash.isDate = isDate;
        lodash.isElement = isElement;
        lodash.isEmpty = isEmpty;
        lodash.isEqual = isEqual;
        lodash.isError = isError;
        lodash.isFinite = isFinite;
        lodash.isFunction = isFunction;
        lodash.isMatch = isMatch;
        lodash.isNaN = isNaN;
        lodash.isNative = isNative;
        lodash.isNull = isNull;
        lodash.isNumber = isNumber;
        lodash.isObject = isObject;
        lodash.isPlainObject = isPlainObject;
        lodash.isRegExp = isRegExp;
        lodash.isString = isString;
        lodash.isTypedArray = isTypedArray;
        lodash.isUndefined = isUndefined;
        lodash.kebabCase = kebabCase;
        lodash.last = last;
        lodash.lastIndexOf = lastIndexOf;
        lodash.max = max;
        lodash.min = min;
        lodash.noConflict = noConflict;
        lodash.noop = noop;
        lodash.now = now;
        lodash.pad = pad;
        lodash.padLeft = padLeft;
        lodash.padRight = padRight;
        lodash.parseInt = parseInt;
        lodash.random = random;
        lodash.reduce = reduce;
        lodash.reduceRight = reduceRight;
        lodash.repeat = repeat;
        lodash.result = result;
        lodash.runInContext = runInContext;
        lodash.size = size;
        lodash.snakeCase = snakeCase;
        lodash.some = some;
        lodash.sortedIndex = sortedIndex;
        lodash.sortedLastIndex = sortedLastIndex;
        lodash.startCase = startCase;
        lodash.startsWith = startsWith;
        lodash.sum = sum;
        lodash.template = template;
        lodash.trim = trim;
        lodash.trimLeft = trimLeft;
        lodash.trimRight = trimRight;
        lodash.trunc = trunc;
        lodash.unescape = unescape;
        lodash.uniqueId = uniqueId;
        lodash.words = words;
        lodash.all = every;
        lodash.any = some;
        lodash.contains = includes;
        lodash.detect = find;
        lodash.foldl = reduce;
        lodash.foldr = reduceRight;
        lodash.head = first;
        lodash.include = includes;
        lodash.inject = reduce;
        mixin(lodash, function () {
            var source = {};
            baseForOwn(lodash, function (func, methodName) {
                if (!lodash.prototype[methodName]) {
                    source[methodName] = func;
                }
            });
            return source;
        }(), false);
        lodash.sample = sample;
        lodash.prototype.sample = function (n) {
            if (!this.__chain__ && n == null) {
                return sample(this.value());
            }
            return this.thru(function (value) {
                return sample(value, n);
            });
        };
        lodash.VERSION = VERSION;
        arrayEach([
            'bind',
            'bindKey',
            'curry',
            'curryRight',
            'partial',
            'partialRight'
        ], function (methodName) {
            lodash[methodName].placeholder = lodash;
        });
        arrayEach([
            'dropWhile',
            'filter',
            'map',
            'takeWhile'
        ], function (methodName, type) {
            var isFilter = type != LAZY_MAP_FLAG, isDropWhile = type == LAZY_DROP_WHILE_FLAG;
            LazyWrapper.prototype[methodName] = function (iteratee, thisArg) {
                var filtered = this.__filtered__, result = filtered && isDropWhile ? new LazyWrapper(this) : this.clone(), iteratees = result.__iteratees__ || (result.__iteratees__ = []);
                iteratees.push({
                    'done': false,
                    'count': 0,
                    'index': 0,
                    'iteratee': getCallback(iteratee, thisArg, 1),
                    'limit': -1,
                    'type': type
                });
                result.__filtered__ = filtered || isFilter;
                return result;
            };
        });
        arrayEach([
            'drop',
            'take'
        ], function (methodName, index) {
            var whileName = methodName + 'While';
            LazyWrapper.prototype[methodName] = function (n) {
                var filtered = this.__filtered__, result = filtered && !index ? this.dropWhile() : this.clone();
                n = n == null ? 1 : nativeMax(floor(n) || 0, 0);
                if (filtered) {
                    if (index) {
                        result.__takeCount__ = nativeMin(result.__takeCount__, n);
                    } else {
                        last(result.__iteratees__).limit = n;
                    }
                } else {
                    var views = result.__views__ || (result.__views__ = []);
                    views.push({
                        'size': n,
                        'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
                    });
                }
                return result;
            };
            LazyWrapper.prototype[methodName + 'Right'] = function (n) {
                return this.reverse()[methodName](n).reverse();
            };
            LazyWrapper.prototype[methodName + 'RightWhile'] = function (predicate, thisArg) {
                return this.reverse()[whileName](predicate, thisArg).reverse();
            };
        });
        arrayEach([
            'first',
            'last'
        ], function (methodName, index) {
            var takeName = 'take' + (index ? 'Right' : '');
            LazyWrapper.prototype[methodName] = function () {
                return this[takeName](1).value()[0];
            };
        });
        arrayEach([
            'initial',
            'rest'
        ], function (methodName, index) {
            var dropName = 'drop' + (index ? '' : 'Right');
            LazyWrapper.prototype[methodName] = function () {
                return this[dropName](1);
            };
        });
        arrayEach([
            'pluck',
            'where'
        ], function (methodName, index) {
            var operationName = index ? 'filter' : 'map', createCallback = index ? baseMatches : property;
            LazyWrapper.prototype[methodName] = function (value) {
                return this[operationName](createCallback(value));
            };
        });
        LazyWrapper.prototype.compact = function () {
            return this.filter(identity);
        };
        LazyWrapper.prototype.reject = function (predicate, thisArg) {
            predicate = getCallback(predicate, thisArg, 1);
            return this.filter(function (value) {
                return !predicate(value);
            });
        };
        LazyWrapper.prototype.slice = function (start, end) {
            start = start == null ? 0 : +start || 0;
            var result = this;
            if (start < 0) {
                result = this.takeRight(-start);
            } else if (start) {
                result = this.drop(start);
            }
            if (end !== undefined) {
                end = +end || 0;
                result = end < 0 ? result.dropRight(-end) : result.take(end - start);
            }
            return result;
        };
        LazyWrapper.prototype.toArray = function () {
            return this.drop(0);
        };
        baseForOwn(LazyWrapper.prototype, function (func, methodName) {
            var lodashFunc = lodash[methodName];
            if (!lodashFunc) {
                return;
            }
            var checkIteratee = /^(?:filter|map|reject)|While$/.test(methodName), retUnwrapped = /^(?:first|last)$/.test(methodName);
            lodash.prototype[methodName] = function () {
                var args = arguments, chainAll = this.__chain__, value = this.__wrapped__, isHybrid = !!this.__actions__.length, isLazy = value instanceof LazyWrapper, iteratee = args[0], useLazy = isLazy || isArray(value);
                if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
                    isLazy = useLazy = false;
                }
                var onlyLazy = isLazy && !isHybrid;
                if (retUnwrapped && !chainAll) {
                    return onlyLazy ? func.call(value) : lodashFunc.call(lodash, this.value());
                }
                var interceptor = function (value) {
                    var otherArgs = [value];
                    push.apply(otherArgs, args);
                    return lodashFunc.apply(lodash, otherArgs);
                };
                if (useLazy) {
                    var wrapper = onlyLazy ? value : new LazyWrapper(this), result = func.apply(wrapper, args);
                    if (!retUnwrapped && (isHybrid || result.__actions__)) {
                        var actions = result.__actions__ || (result.__actions__ = []);
                        actions.push({
                            'func': thru,
                            'args': [interceptor],
                            'thisArg': lodash
                        });
                    }
                    return new LodashWrapper(result, chainAll);
                }
                return this.thru(interceptor);
            };
        });
        arrayEach([
            'concat',
            'join',
            'pop',
            'push',
            'replace',
            'shift',
            'sort',
            'splice',
            'split',
            'unshift'
        ], function (methodName) {
            var func = (/^(?:replace|split)$/.test(methodName) ? stringProto : arrayProto)[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru', retUnwrapped = /^(?:join|pop|replace|shift)$/.test(methodName);
            lodash.prototype[methodName] = function () {
                var args = arguments;
                if (retUnwrapped && !this.__chain__) {
                    return func.apply(this.value(), args);
                }
                return this[chainName](function (value) {
                    return func.apply(value, args);
                });
            };
        });
        baseForOwn(LazyWrapper.prototype, function (func, methodName) {
            var lodashFunc = lodash[methodName];
            if (lodashFunc) {
                var key = lodashFunc.name, names = realNames[key] || (realNames[key] = []);
                names.push({
                    'name': methodName,
                    'func': lodashFunc
                });
            }
        });
        realNames[createHybridWrapper(null, BIND_KEY_FLAG).name] = [{
                'name': 'wrapper',
                'func': null
            }];
        LazyWrapper.prototype.clone = lazyClone;
        LazyWrapper.prototype.reverse = lazyReverse;
        LazyWrapper.prototype.value = lazyValue;
        lodash.prototype.chain = wrapperChain;
        lodash.prototype.commit = wrapperCommit;
        lodash.prototype.plant = wrapperPlant;
        lodash.prototype.reverse = wrapperReverse;
        lodash.prototype.toString = wrapperToString;
        lodash.prototype.run = lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
        lodash.prototype.collect = lodash.prototype.map;
        lodash.prototype.head = lodash.prototype.first;
        lodash.prototype.select = lodash.prototype.filter;
        lodash.prototype.tail = lodash.prototype.rest;
        return lodash;
    }
    var _ = runInContext();
    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        define('lodash/main', [], function () {
            return _;
        });
    }
}.call(this));

define('lodash', ['lodash/main'], function ( main ) { return main; });

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

void function (define, global) {
    define('promise/enhance', [
        'require',
        './util'
    ], function (require) {
        var u = require('./util');
        function isPromise(obj) {
            return typeof u.getThen(obj) === 'function';
        }
        function promiseRequire(modules) {
            var isAborted = false;
            var promise = new this(function (resolve, reject) {
                    global.require(modules, function () {
                        !isAborted && resolve([].slice.call(arguments));
                    });
                });
            promise.abort = function () {
                isAborted = true;
            };
            return promise;
        }
        function ensure(callback) {
            var Promise = this.constructor;
            return this.then(function (value) {
                Promise.resolve(callback()).then(function () {
                    return value;
                });
            }, function (reason) {
                Promise.resolve(callback()).then(function () {
                    throw reason;
                });
            });
        }
        function invoke(fn, thisObj, args) {
            try {
                args = [].slice.call(arguments, 2);
                var value = fn.apply(thisObj, args);
                return isPromise(value) ? value : this.resolve(value);
            } catch (e) {
                return this.reject(e);
            }
        }
        function cast(value) {
            if (value && typeof value === 'object' && value.constructor === this) {
                return value;
            }
            return new this(function (resolve) {
                resolve(value);
            });
        }
        return function (Promise) {
            Promise.isPromise = isPromise;
            Promise.require = promiseRequire;
            Promise.invoke = invoke;
            Promise.cast = cast;
            Promise.prototype['finally'] = ensure;
            Promise.prototype.ensure = ensure;
            Promise.prototype.fail = Promise.prototype['catch'];
            return Promise;
        };
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
}, this);

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

void function (define) {
    define('promise/hook', [
        'require',
        './PromiseCapacity'
    ], function (require) {
        var PromiseCapacity = require('./PromiseCapacity');
        return function (Promise) {
            Promise.onReject = function (handler) {
                if (typeof handler === 'function') {
                    PromiseCapacity.onReject = handler;
                }
            };
            Promise.onResolve = function (handler) {
                if (typeof handler === 'function') {
                    PromiseCapacity.onResolve = handler;
                }
            };
            return Promise;
        };
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
}, this);

void function (define) {
    define('promise/main', [
        'require',
        './Promise',
        './enhance',
        './then',
        './hook'
    ], function (require) {
        var Promise = require('./Promise');
        var enhance = require('./enhance');
        var then = require('./then');
        var hook = require('./hook');
        return hook(then(enhance(Promise)));
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
}, this);

define('promise', ['promise/main'], function ( main ) { return main; });

define('k-component/cache', [
    'require',
    'lodash'
], function (require) {
    var _ = require('lodash');
    var owners = [];
    var caches = [];
    var rparse = /^(?:null|false|true|NaN|\{.*\}|\[.*\])$/;
    var cacheUtil = {
            hasData: function (owner) {
                return owners.indexOf(owner) > -1;
            },
            data: function (target, name, data) {
                return innerData(target, name, data);
            },
            _data: function (target, name, data) {
                return innerData(target, name, data, true);
            },
            removeData: function (target, name) {
                return innerRemoveData(target, name);
            },
            _removeData: function (target, name) {
                return innerRemoveData(target, name, true);
            },
            parseData: function (target, name, cache, value) {
                var data;
                var _eval;
                var key = _.camelize(name);
                if (cache && key in cache) {
                    return cache[key];
                }
                if (arguments.length !== 4) {
                    var attr = 'data-' + name.replace(/([A-Z])/g, '-$1').toLowerCase();
                    value = target.getAttribute(attr);
                }
                if (typeof value === 'string') {
                    if (rparse.test(value) || +value + '' === value) {
                        _eval = true;
                    }
                    try {
                        data = _eval ? eval('0,' + value) : value;
                    } catch (e) {
                        data = value;
                    }
                    if (cache) {
                        cache[key] = data;
                    }
                }
                return data;
            },
            curry: function (target) {
                return {
                    get: _.partial(cacheUtil.data, target),
                    set: _.partial(cacheUtil.data, target),
                    remove: _.partial(cacheUtil.removeData, target),
                    hasData: _.partial(cacheUtil.hasData, target)
                };
            }
        };
    function add(owner) {
        var index = owners.push(owner);
        return caches[index - 1] = { data: {} };
    }
    function innerData(owner, name, data, pvt) {
        var index = owners.indexOf(owner);
        var table = index === -1 ? add(owner) : caches[index];
        var getOne = typeof name === 'string';
        var cache = table;
        if (!pvt) {
            table = table.data;
        }
        if (name && typeof name === 'object') {
            $.mix(table, name);
        } else if (getOne && data !== void 0) {
            table[name] = data;
        }
        if (getOne) {
            if (name in table) {
                return table[name];
            } else if (!pvt && owner && owner.nodeType === 1) {
                return cacheUtil.parseData(owner, name, cache);
            }
        } else {
            return table;
        }
    }
    function innerRemoveData(owner, name, pvt) {
        var index = owners.indexOf(owner);
        if (index > -1) {
            var delOne = typeof name === 'string';
            var table = caches[index];
            var cache = table;
            if (delOne) {
                if (!pvt) {
                    table = table.data;
                }
                if (table) {
                    delOne = table[name];
                    delete table[name];
                }
                if (JSON.stringify(cache) === '{"data":{}}') {
                    owners.splice(index, 1);
                    caches.splice(index, 1);
                }
            }
            return delOne;
        }
    }
    return cacheUtil;
});

define('k-component/config', ['require'], function (require) {
    var config = {
            LOADER_FILE_SUFFIX: 'component.html',
            REGISTER_TAG: 'k-component',
            CACHED_ACTION_KEY: '$$_COMPONENT_ACTION_$$'
        };
    return config;
});

define('k-component/k', [
    'require',
    'lodash',
    './lib/zepto',
    'promise',
    './cache',
    './config'
], function (require) {
    var _ = require('lodash');
    var $ = require('./lib/zepto');
    var Promise = require('promise');
    var cache = require('./cache');
    var config = require('./config');
    var isSupportShadowDOM = !!document.body.createShadowRoot;
    var getK = function (el) {
        return cache._data(el, config.CACHED_ACTION_KEY);
    };
    var $k = function (el) {
        return new K(el);
    };
    $k.get = getK;
    $k.$ = function (query, condition) {
        if (typeof query === 'string') {
            var result = $(query, condition);
            if (isSupportShadowDOM) {
                result = $(_.toArray(result).concat(_.toArray($('::shadow ' + query, condition))));
            }
            return result;
        }
        return $(query, condition);
    };
    function K(query) {
        var me = this;
        if (typeof query === 'string') {
            me.target = $k.$(query);
        } else {
            me.target = $(query);
        }
        var promises = [];
        _.each(me.target, function (item) {
            if (!item.promise) {
                setTimeout(function (promise) {
                    promises.push(promise);
                }(item.promise), 1);
            } else {
                promises.push(item.promise);
            }
        });
        me.components = [];
        me.promise = Promise.all(promises).then(function () {
            var index = 0;
            _.each(me.target, function (eachTarget) {
                me[index++] = getK(eachTarget);
                me.components.push(getK(eachTarget));
            });
        });
    }
    K.prototype.execute = function (methodName) {
        var me = this;
        var args = _.toArray(arguments).slice(1);
        me.target && me.promise.then(function () {
            _.each(me.components, function (item) {
                item[methodName].apply(item, args);
            });
        });
    };
    K.prototype.on = function (type, fn, thisObject, options) {
        var args = [].slice.call(arguments);
        args.unshift('on');
        this.execute.apply(this, args);
    };
    K.prototype.ready = function (fn) {
        var args = [].slice.call(arguments);
        args.unshift('ready');
        this.execute.apply(this, args);
    };
    return $k;
});

(function (window, document, Object) {
    var factory = function () {
        var REGISTER_ELEMENT = 'registerElement';
        if (REGISTER_ELEMENT in document)
            return;
        var EXPANDO_UID = '__' + REGISTER_ELEMENT + (Math.random() * 100000 >> 0), EXTENDS = 'extends', DOM_ATTR_MODIFIED = 'DOMAttrModified', DOM_SUBTREE_MODIFIED = 'DOMSubtreeModified', PREFIX_TAG = '<', PREFIX_IS = '=', validName = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/, invalidNames = [
                'ANNOTATION-XML',
                'COLOR-PROFILE',
                'FONT-FACE',
                'FONT-FACE-SRC',
                'FONT-FACE-URI',
                'FONT-FACE-FORMAT',
                'FONT-FACE-NAME',
                'MISSING-GLYPH'
            ], types = [], protos = [], query = '', documentElement = document.documentElement, indexOf = types.indexOf || function (v) {
                for (var i = this.length; i-- && this[i] !== v;) {
                }
                return i;
            }, OP = Object.prototype, hOP = OP.hasOwnProperty, iPO = OP.isPrototypeOf, defineProperty = Object.defineProperty, gOPD = Object.getOwnPropertyDescriptor, gOPN = Object.getOwnPropertyNames, gPO = Object.getPrototypeOf, sPO = Object.setPrototypeOf, hasProto = !!Object.__proto__, create = Object.create || function Bridge(proto) {
                return proto ? (Bridge.prototype = proto, new Bridge()) : this;
            }, setPrototype = sPO || (hasProto ? function (o, p) {
                o.__proto__ = p;
                return o;
            } : gOPN && gOPD ? function () {
                function setProperties(o, p) {
                    for (var key, names = gOPN(p), i = 0, length = names.length; i < length; i++) {
                        key = names[i];
                        if (!hOP.call(o, key)) {
                            defineProperty(o, key, gOPD(p, key));
                        }
                    }
                }
                return function (o, p) {
                    do {
                        setProperties(o, p);
                    } while (p = gPO(p));
                    return o;
                };
            }() : function (o, p) {
                for (var key in p) {
                    o[key] = p[key];
                }
                return o;
            }), MutationObserver = window.MutationObserver || window.WebKitMutationObserver, HTMLElementPrototype = (window.HTMLElement || window.Element || window.Node).prototype, cloneNode = HTMLElementPrototype.cloneNode, setAttribute = HTMLElementPrototype.setAttribute, createElement = document.createElement, attributesObserver = MutationObserver && {
                attributes: true,
                characterData: true,
                attributeOldValue: true
            }, DOMAttrModified = MutationObserver || function (e) {
                doesNotSupportDOMAttrModified = false;
                documentElement.removeEventListener(DOM_ATTR_MODIFIED, DOMAttrModified);
            }, setListener = false, doesNotSupportDOMAttrModified = true, onSubtreeModified, callDOMAttrModified, getAttributesMirror, observer, patchIfNotAlready, patch;
        ;
        if (sPO || hasProto) {
            patchIfNotAlready = function (node, proto) {
                if (!iPO.call(proto, node)) {
                    setupNode(node, proto);
                }
            };
            patch = setupNode;
        } else {
            patchIfNotAlready = function (node, proto) {
                if (!node[EXPANDO_UID]) {
                    node[EXPANDO_UID] = Object(true);
                    setupNode(node, proto);
                }
            };
            patch = patchIfNotAlready;
        }
        if (!MutationObserver) {
            documentElement.addEventListener(DOM_ATTR_MODIFIED, DOMAttrModified);
            documentElement.setAttribute(EXPANDO_UID, 1);
            documentElement.removeAttribute(EXPANDO_UID);
            if (doesNotSupportDOMAttrModified) {
                onSubtreeModified = function (e) {
                    var node = this, oldAttributes, newAttributes, key;
                    ;
                    if (node === e.target) {
                        oldAttributes = node[EXPANDO_UID];
                        node[EXPANDO_UID] = newAttributes = getAttributesMirror(node);
                        for (key in newAttributes) {
                            if (!(key in oldAttributes)) {
                                return callDOMAttrModified(0, node, key, oldAttributes[key], newAttributes[key], 'ADDITION');
                            } else if (newAttributes[key] !== oldAttributes[key]) {
                                return callDOMAttrModified(1, node, key, oldAttributes[key], newAttributes[key], 'MODIFICATION');
                            }
                        }
                        for (key in oldAttributes) {
                            if (!(key in newAttributes)) {
                                return callDOMAttrModified(2, node, key, oldAttributes[key], newAttributes[key], 'REMOVAL');
                            }
                        }
                    }
                };
                callDOMAttrModified = function (attrChange, currentTarget, attrName, prevValue, newValue, action) {
                    var e = {
                            attrChange: attrChange,
                            currentTarget: currentTarget,
                            attrName: attrName,
                            prevValue: prevValue,
                            newValue: newValue
                        };
                    e[action] = attrChange;
                    onDOMAttrModified(e);
                };
                getAttributesMirror = function (node) {
                    for (var attr, name, result = {}, attributes = node.attributes, i = 0, length = attributes.length; i < length; i++) {
                        attr = attributes[i];
                        name = attr.name;
                        if (name !== 'setAttribute') {
                            result[name] = attr.value;
                        }
                    }
                    return result;
                };
            }
        }
        function loopAndVerify(list, action) {
            for (var i = 0, length = list.length; i < length; i++) {
                verifyAndSetupAndAction(list[i], action);
            }
        }
        function loopAndSetup(list) {
            for (var i = 0, length = list.length, node; i < length; i++) {
                node = list[i];
                patch(node, protos[getTypeIndex(node)]);
            }
        }
        function executeAction(action) {
            return function (node) {
                if (iPO.call(HTMLElementPrototype, node)) {
                    verifyAndSetupAndAction(node, action);
                    loopAndVerify(node.querySelectorAll(query), action);
                }
            };
        }
        function getTypeIndex(target) {
            var is = target.getAttribute('is'), nodeName = target.nodeName, i = indexOf.call(types, is ? PREFIX_IS + is.toUpperCase() : PREFIX_TAG + nodeName);
            ;
            return is && -1 < i && !isInQSA(nodeName, is) ? -1 : i;
        }
        function isInQSA(name, type) {
            return -1 < query.indexOf(name + '[is="' + type + '"]');
        }
        function onDOMAttrModified(e) {
            var node = e.currentTarget, attrChange = e.attrChange, prevValue = e.prevValue, newValue = e.newValue;
            ;
            if (node.attributeChangedCallback && e.attrName !== 'style') {
                node.attributeChangedCallback(e.attrName, attrChange === e.ADDITION ? null : prevValue, attrChange === e.REMOVAL ? null : newValue);
            }
        }
        function onDOMNode(action) {
            var executor = executeAction(action);
            return function (e) {
                executor(e.target);
            };
        }
        function patchedSetAttribute(name, value) {
            var self = this;
            setAttribute.call(self, name, value);
            onSubtreeModified.call(self, { target: self });
        }
        function setupNode(node, proto) {
            setPrototype(node, proto);
            if (observer) {
                observer.observe(node, attributesObserver);
            } else {
                if (doesNotSupportDOMAttrModified) {
                    node.setAttribute = patchedSetAttribute;
                    node[EXPANDO_UID] = getAttributesMirror(node);
                    node.addEventListener(DOM_SUBTREE_MODIFIED, onSubtreeModified);
                }
                node.addEventListener(DOM_ATTR_MODIFIED, onDOMAttrModified);
            }
            if (node.createdCallback) {
                node.created = true;
                node.createdCallback();
                node.created = false;
            }
        }
        function verifyAndSetupAndAction(node, action) {
            var fn, i = getTypeIndex(node), attached = 'attached', detached = 'detached';
            ;
            if (-1 < i) {
                patchIfNotAlready(node, protos[i]);
                i = 0;
                if (action === attached && !node[attached]) {
                    node[detached] = false;
                    node[attached] = true;
                    i = 1;
                } else if (action === detached && !node[detached]) {
                    node[attached] = false;
                    node[detached] = true;
                    i = 1;
                }
                if (i && (fn = node[action + 'Callback']))
                    fn.call(node);
            }
        }
        document[REGISTER_ELEMENT] = function registerElement(type, options) {
            upperType = type.toUpperCase();
            if (!setListener) {
                setListener = true;
                if (MutationObserver) {
                    observer = function (attached, detached) {
                        function checkEmAll(list, callback) {
                            for (var i = 0, length = list.length; i < length; callback(list[i++])) {
                            }
                        }
                        return new MutationObserver(function (records) {
                            for (var current, node, i = 0, length = records.length; i < length; i++) {
                                current = records[i];
                                if (current.type === 'childList') {
                                    checkEmAll(current.addedNodes, attached);
                                    checkEmAll(current.removedNodes, detached);
                                } else {
                                    node = current.target;
                                    if (node.attributeChangedCallback && current.attributeName !== 'style') {
                                        node.attributeChangedCallback(current.attributeName, current.oldValue, node.getAttribute(current.attributeName));
                                    }
                                }
                            }
                        });
                    }(executeAction('attached'), executeAction('detached'));
                    observer.observe(document, {
                        childList: true,
                        subtree: true
                    });
                } else {
                    document.addEventListener('DOMNodeInserted', onDOMNode('attached'));
                    document.addEventListener('DOMNodeRemoved', onDOMNode('detached'));
                }
                document.addEventListener('readystatechange', function (e) {
                    loopAndVerify(document.querySelectorAll(query), 'attached');
                });
                document.createElement = function (localName, typeExtension) {
                    var node = createElement.apply(document, arguments), i = indexOf.call(types, (typeExtension ? PREFIX_IS : PREFIX_TAG) + (typeExtension || localName).toUpperCase()), setup = -1 < i;
                    ;
                    if (typeExtension) {
                        node.setAttribute('is', typeExtension = typeExtension.toLowerCase());
                        if (setup) {
                            setup = isInQSA(localName.toUpperCase(), typeExtension);
                        }
                    }
                    if (setup)
                        patch(node, protos[i]);
                    return node;
                };
                HTMLElementPrototype.cloneNode = function (deep) {
                    var node = cloneNode.call(this, !!deep), i = getTypeIndex(node);
                    ;
                    if (-1 < i)
                        patch(node, protos[i]);
                    if (deep)
                        loopAndSetup(node.querySelectorAll(query));
                    return node;
                };
            }
            if (-2 < indexOf.call(types, PREFIX_IS + upperType) + indexOf.call(types, PREFIX_TAG + upperType)) {
                throw new Error('A ' + type + ' type is already registered');
            }
            if (!validName.test(upperType) || -1 < indexOf.call(invalidNames, upperType)) {
                throw new Error('The type ' + type + ' is invalid');
            }
            var constructor = function () {
                    return document.createElement(nodeName, extending && upperType);
                }, opt = options || OP, extending = hOP.call(opt, EXTENDS), nodeName = extending ? options[EXTENDS].toUpperCase() : upperType, i = types.push((extending ? PREFIX_IS : PREFIX_TAG) + upperType) - 1, upperType;
            ;
            query = query.concat(query.length ? ',' : '', extending ? nodeName + '[is="' + type.toLowerCase() + '"]' : nodeName);
            constructor.prototype = protos[i] = hOP.call(opt, 'prototype') ? opt.prototype : create(HTMLElementPrototype);
            loopAndVerify(document.querySelectorAll(query), 'attached');
            return constructor;
        };
    };
    if (typeof define === 'function' && define.amd) {
        define('custom-element-shim/document-register-element', [], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(window, document, Object));

define('custom-element-shim', ['custom-element-shim/document-register-element'], function ( main ) { return main; });

define('k-component/registry', [
    'require',
    'lodash',
    './cache',
    'custom-element-shim',
    './config',
    'etpl',
    'promise'
], function (require) {
    var _ = require('lodash');
    var cache = require('./cache');
    require('custom-element-shim');
    var config = require('./config');
    var etpl = require('etpl');
    var Promise = require('promise');
    var registerTagPrototype = {};
    var isSupportShadowDOM = !!document.body.createShadowRoot;
    var getK = function (el) {
        return cache._data(el, config.CACHED_ACTION_KEY);
    };
    registerTagPrototype.createdCallback = function () {
        var tagName = this.getAttribute('name');
        var template = this.querySelector('template');
        var actionPath = this.getAttribute('action');
        register(tagName, {
            template: template,
            actionPath: actionPath,
            createdCallback: function () {
                this.setAttribute('k-component', true);
                var me = this;
                processShadowRoot(me);
                me.promise = new Promise(function (resolve, reject) {
                    if (me.actionPath) {
                        Promise.require([me.actionPath]).then(function (Action) {
                            if (_.isArray(Action)) {
                                Action = Action[0];
                            }
                            var action = new Action({ el: me });
                            cache._data(me, config.CACHED_ACTION_KEY, action);
                            action.ready(function () {
                                resolve();
                            });
                        }).catch(reject);
                    } else {
                        resolve();
                    }
                });
            },
            attachedCallback: function () {
                var me = this;
            },
            detachedCallback: function () {
                var me = this;
                me.promise && me.promise.then(function () {
                    getK(me) && getK(me).dispose();
                });
            },
            attributeChangedCallback: function (attrName, oldVal, newVal) {
                var me = this;
                me.promise && me.promise.then(function () {
                    getK(me) && getK(me).attributeChangedCallback(attrName, oldVal, newVal);
                });
            }
        });
    };
    function processShadowRoot(me) {
        var template = me.template;
        if (me.componentInited) {
            return;
        }
        if (isSupportShadowDOM) {
            var shadow = me.createShadowRoot();
            var clone = document.importNode(template.content, true);
            shadow.appendChild(clone);
            var content = shadow.querySelector('content');
            if (!content) {
                content = document.createElement('content');
                shadow.appendChild(content);
            }
            me.content = me;
        } else {
            var fakeShadowRoot = document.createElement('fake-shadow-root');
            fakeShadowRoot.innerHTML = template.innerHTML;
            me.shadowRoot = fakeShadowRoot;
            me.appendChild(fakeShadowRoot);
            var content = fakeShadowRoot.querySelector('content');
            if (!content) {
                content = document.createElement('content');
                fakeShadowRoot.appendChild(content);
            }
            me.content = content;
            for (var i = me.childNodes.length - 1; i >= 0; i--) {
                if (me.childNodes[i].nodeType === 1 && me.childNodes[i].tagName.toLowerCase() === 'fake-shadow-root') {
                    continue;
                }
                if (content.childNodes.length === 0) {
                    content.appendChild(me.childNodes[i]);
                } else {
                    content.insertBefore(me.childNodes[i], content.firstChild);
                }
            }
        }
        me.componentInited = true;
    }
    registerTagPrototype.attachedCallback = function () {
    };
    register(config.REGISTER_TAG, registerTagPrototype);
    function register(name, protoExt) {
        document.registerElement(name, { prototype: _.extend(Object.create(HTMLElement.prototype), protoExt || {}) });
    }
    var registry = {
            registerFromHTML: function (html) {
                var container;
                container = getRegisterContaienr();
                container.innerHTML = html;
            }
        };
    function getRegisterContaienr() {
        var id = '$$$__register_temp_container__$$$';
        var container = document.getElementById(id);
        if (container) {
            return container;
        }
        container = document.createElement('div');
        container.id = id;
        container.style.width = 0;
        container.style.height = 0;
        container.style.overflow = 'hidden';
        document.body.appendChild(container);
        return container;
    }
    return registry;
});

define('k-component/component', [
    'require',
    'exports',
    'module',
    'k-component/config',
    'k-component/registry'
], function (require, exports, module) {
    'use strict';
    var config = require('k-component/config');
    var registry = require('k-component/registry');
    return {
        load: function (resourceId, req, load) {
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.open('GET', req.toUrl(resourceId + '.' + config.LOADER_FILE_SUFFIX), true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var source = xhr.responseText;
                        registry.registerFromHTML(source);
                        load(source);
                    }
                    xhr.onreadystatechange = new Function();
                    xhr = null;
                }
            };
            xhr.send(null);
        }
    };
});

define('componentConfig', ['require'], function (require) {
    return {
        'mark-commandable': {
            html: [
                '<h1>\u54EA\u4E2A\u662F\u771F\u7684a\uFF0C\u70B9\u70B9\u770B</h1>',
                '<ul id="command-test">',
                '    <mark-commandable event-type="click"></mark-commandable>',
                '    <li>a</li>',
                '    <li data-command="real">a</li>',
                '    <li>a</li>',
                '    <li>a</li>',
                '</ul>'
            ].join('\n'),
            less: [
                '#command-test {',
                '    border: 2px solid green;',
                '    padding: 10px;',
                '    li {',
                '        cursor: pointer;',
                '        list-style: none;',
                '        padding: 3px 8px;',
                '        background-color: #efefef;',
                '        margin: 5px 0;',
                '    }',
                '}'
            ].join('\n'),
            javascript: [
                'var $k = require(\'k-component/k\');',
                '$k.$(\'#command-test\').on(\'command:real\', function (e) {',
                '    alert(\'\u6211\u624D\u662F\u771F\u7684\')',
                '})'
            ].join('\n')
        },
        'mark-selectable': {
            html: [
                '<ul class="mark-selectable-test">',
                '    <mark-selectable selection="*"></mark-selectable>',
                '    <li>a</li>',
                '    <li>b</li>',
                '    <li>c</li>',
                '</ul>',
                '<ul class="mark-selectable-test">',
                '    <mark-selectable selection="*" multi></mark-selectable>',
                '    <li>a</li>',
                '    <li>b</li>',
                '    <li>c</li>',
                '</ul>'
            ].join('\n'),
            less: [
                '.mark-selectable-test {',
                '    border: 2px solid green;',
                '    padding: 10px;',
                '    li {',
                '        cursor: pointer;',
                '        list-style: none;',
                '        padding: 3px 8px;',
                '        background-color: #efefef;',
                '        margin: 5px 0;',
                '        &.selected {',
                '            background-color: green;',
                '            color: #ffffff;',
                '        }',
                '    }',
                '}'
            ].join('\n'),
            javascript: ['var $k = require(\'k-component/k\');'].join('\n')
        },
        'k-selection': {
            html: [
                '<k-selection id="hello">',
                '    <li>a</li>',
                '    <li>b</li>',
                '    <li>c</li>',
                '    <li>d</li>',
                '</k-selection>',
                '<k-selection id="hello1" multi>',
                '    <li>a</li>',
                '    <li>b</li>',
                '    <li>c</li>',
                '    <li>d</li>',
                '</k-selection>',
                '<k-selection id="hello2" multi>',
                '    <k-list>',
                '        <li>${item}</li>',
                '    </k-list>',
                '</k-selection>'
            ].join('\n'),
            less: [
                '#hello, #hello1, #hello2 {',
                '    display: block;',
                '    margin: 10px 0;',
                '    padding: 0;',
                '    position: relative;',
                '    li {',
                '        cursor: pointer;',
                '        list-style: none;',
                '        padding: 2px 8px;',
                '        &:hover {',
                '            background-color: #efefef;',
                '        }',
                '        &.selected {',
                '            background-color: #cdef00;',
                '        }',
                '    }',
                '}'
            ].join('\n'),
            javascript: [
                'var $k = require(\'k-component/k\');',
                '$k(\'#hello\').on(\'select\', function (e) {',
                '    console.log(e.selection);',
                '});',
                '$k(\'#hello2 k-list\').ready(function () {',
                '    var list = [];',
                '    var len = 4;',
                '    for (var i = 0; i < len; i++) {',
                '        list.push(Math.random() * 10);',
                '    }',
                '    this.setList(list);',
                '});'
            ].join('\n')
        },
        'k-list': {
            html: [
                '<k-list id="list1">',
                '    <li>',
                '        <!-- for: ${item} as ${v}, ${k} -->',
                '        ${k} is ${v}',
                '        <!-- /for -->',
                '    </li>',
                '</k-list>'
            ].join('\n'),
            less: [
                '#list1 {',
                '    display: block;',
                '    margin: 10px 0;',
                '    padding: 0;',
                '    position: relative;',
                '    li {',
                '        list-style: none;',
                '        padding: 2px 8px;',
                '        &:hover {',
                '            background-color: #efefef;',
                '        }',
                '        &[selected] {',
                '            background-color: #cdef00;',
                '        }',
                '    }',
                '}'
            ].join('\n'),
            javascript: [
                'var $k = require(\'k-component/k\');',
                '$k(\'#list1\').ready(function () {',
                '    var list = [];',
                '    var len = 10;',
                '    for (var i = 0; i < len; i++) {',
                '        list.push({',
                '            name: \'name\' + Math.floor(Math.random() * 10),',
                '            age: Math.floor(Math.random() * 30),',
                '            aaa: [11, 13, 31][Math.floor(Math.random() * 3)],',
                '            children: [1,2,3]',
                '        });',
                '    }',
                '    this.setList(list);',
                '});'
            ].join('\n')
        },
        'k-item': {
            html: '<k-item>\u5360\u4E2A\u4F4D\u7F6E\u800C\u5DF2\uFF0C\u4EE5\u540E\u8981\u7528 ICON \u7684</k-item>',
            less: '',
            javascript: ['var $k = require(\'k-component/k\');'].join('\n')
        },
        'k-menu': {
            html: [
                '<k-menu id="menu1">',
                '    <mark-commandable></mark-commandable>',
                '    <k-list>',
                '        <k-item data-command="word" data-command-args="${item.word}">',
                '            ${item.text}',
                '        </k-item>',
                '    </k-list>',
                '</k-menu>'
            ].join('\n'),
            less: [
                '#menu1 {',
                '    border: 3px solid green;',
                '    padding: 5px 10px;',
                '    margin: 0;',
                '    position: relative;',
                '    display: block;',
                '    k-item {',
                '        display: block;',
                '        border: 2px solid green;',
                '        padding: 2px 8px;',
                '        margin: 5px 0;',
                '        cursor: pointer;',
                '        &:hover {',
                '            color: #ffffff;',
                '            background-color: lightgreen;',
                '        }',
                '        &.selected {',
                '            color: #ffffff;',
                '            background-color: green;',
                '        }',
                '    }',
                '}'
            ].join('\n'),
            javascript: [
                'var $k = require(\'k-component/k\');',
                'var $ = require(\'k-component/lib/zepto\');',
                '$k(\'#menu1\').ready(function () {',
                '    $(this.el).on(\'command:word\', function (e, args) {',
                '        alert(args);',
                '    });',
                '});',
                '$k(\'#menu1 k-list\').ready(function () {',
                '    var list = [];',
                '    var len = 10;',
                '    for (var i = 0; i < len; i++) {',
                '        list.push({',
                '            text: \'menu\' + Math.floor(Math.random() * 10),',
                '            word: \'\u64E6\u64E6 * \' + Math.floor(Math.random() * 10)',
                '        });',
                '    }',
                '    this.setList(list);',
                '});'
            ].join('\n')
        }
    };
});

define('main', [
    'require',
    'fc-core',
    'underscore',
    'k-component/lib/zepto',
    'k-component/k',
    'k-component/component!k-component-element/k-selection',
    'k-component/component!./demo-preview',
    './componentConfig'
], function (require) {
    require('fc-core');
    var _ = require('underscore');
    var $ = require('k-component/lib/zepto');
    var $k = require('k-component/k');
    require('k-component/component!k-component-element/k-selection');
    require('k-component/component!./demo-preview');
    var componentConfig = require('./componentConfig');
    var html = [];
    _.each(_.keys(componentConfig), function (name) {
        html.push('<li path="' + name + '">' + name + '</li>');
    });
    var menu = document.getElementById('main-menu');
    $k(menu).ready(function () {
        this.content.innerHTML = html.join('');
        $(this.el).on('select', function (e) {
            var path = $(this.selection.getSelected()).attr('path');
            $('demo-preview', $('#main')).attr('path', path);
        });
        this.select(this.content.children[0]);
    });
});