define('lodash/internal/baseDifference', [
    './baseIndexOf',
    './cacheIndexOf',
    './createCache'
], function (baseIndexOf, cacheIndexOf, createCache) {
    function baseDifference(array, values) {
        var length = array ? array.length : 0, result = [];
        if (!length) {
            return result;
        }
        var index = -1, indexOf = baseIndexOf, isCommon = true, cache = isCommon && values.length >= 200 ? createCache(values) : null, valuesLength = values.length;
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
    return baseDifference;
});