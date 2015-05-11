define('lodash/array/chunk', [
    '../internal/baseSlice',
    '../internal/isIterateeCall'
], function (baseSlice, isIterateeCall) {
    var ceil = Math.ceil;
    var nativeMax = Math.max;
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
    return chunk;
});