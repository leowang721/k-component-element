define('lodash/internal/arraySome', [], function () {
    function arraySome(array, predicate) {
        var index = -1, length = array.length;
        while (++index < length) {
            if (predicate(array[index], index, array)) {
                return true;
            }
        }
        return false;
    }
    return arraySome;
});