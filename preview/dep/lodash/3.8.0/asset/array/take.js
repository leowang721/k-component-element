define('lodash/array/take', [
    '../internal/baseSlice',
    '../internal/isIterateeCall'
], function (baseSlice, isIterateeCall) {
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
    return take;
});