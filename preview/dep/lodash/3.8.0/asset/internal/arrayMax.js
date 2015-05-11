define('lodash/internal/arrayMax', [], function () {
    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
    function arrayMax(array) {
        var index = -1, length = array.length, result = NEGATIVE_INFINITY;
        while (++index < length) {
            var value = array[index];
            if (value > result) {
                result = value;
            }
        }
        return result;
    }
    return arrayMax;
});