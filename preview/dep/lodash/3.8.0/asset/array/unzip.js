define('lodash/array/unzip', [
    '../internal/arrayFilter',
    '../internal/arrayMap',
    '../internal/baseProperty',
    '../internal/isArrayLike'
], function (arrayFilter, arrayMap, baseProperty, isArrayLike) {
    var nativeMax = Math.max;
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
    return unzip;
});