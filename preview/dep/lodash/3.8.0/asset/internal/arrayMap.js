define('lodash/internal/arrayMap', [], function () {
    function arrayMap(array, iteratee) {
        var index = -1, length = array.length, result = Array(length);
        while (++index < length) {
            result[index] = iteratee(array[index], index, array);
        }
        return result;
    }
    return arrayMap;
});