define('lodash/internal/baseFindIndex', [], function () {
    function baseFindIndex(array, predicate, fromRight) {
        var length = array.length, index = fromRight ? length : -1;
        while (fromRight ? index-- : ++index < length) {
            if (predicate(array[index], index, array)) {
                return index;
            }
        }
        return -1;
    }
    return baseFindIndex;
});