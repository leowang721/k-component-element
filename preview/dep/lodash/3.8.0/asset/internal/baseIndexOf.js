define('lodash/internal/baseIndexOf', ['./indexOfNaN'], function (indexOfNaN) {
    function baseIndexOf(array, value, fromIndex) {
        if (value !== value) {
            return indexOfNaN(array, fromIndex);
        }
        var index = fromIndex - 1, length = array.length;
        while (++index < length) {
            if (array[index] === value) {
                return index;
            }
        }
        return -1;
    }
    return baseIndexOf;
});