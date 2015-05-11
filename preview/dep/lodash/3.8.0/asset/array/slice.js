define('lodash/array/slice', [
    '../internal/baseSlice',
    '../internal/isIterateeCall'
], function (baseSlice, isIterateeCall) {
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
    return slice;
});