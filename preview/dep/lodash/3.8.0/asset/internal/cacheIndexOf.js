define('lodash/internal/cacheIndexOf', ['../lang/isObject'], function (isObject) {
    function cacheIndexOf(cache, value) {
        var data = cache.data, result = typeof value == 'string' || isObject(value) ? data.set.has(value) : data.hash[value];
        return result ? 0 : -1;
    }
    return cacheIndexOf;
});