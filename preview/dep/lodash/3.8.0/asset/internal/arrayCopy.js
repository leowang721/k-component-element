define('lodash/internal/arrayCopy', [], function () {
    function arrayCopy(source, array) {
        var index = -1, length = source.length;
        array || (array = Array(length));
        while (++index < length) {
            array[index] = source[index];
        }
        return array;
    }
    return arrayCopy;
});