define('lodash/internal/arrayMin', [], function () {
    var POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
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
    return arrayMin;
});