define('lodash/array/takeRight', [
    '../internal/baseSlice',
    '../internal/isIterateeCall'
], function (baseSlice, isIterateeCall) {
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
    return takeRight;
});