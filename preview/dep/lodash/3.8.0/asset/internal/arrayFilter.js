define('lodash/internal/arrayFilter', [], function () {
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
    return arrayFilter;
});