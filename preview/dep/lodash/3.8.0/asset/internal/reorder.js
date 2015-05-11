define('lodash/internal/reorder', [
    './arrayCopy',
    './isIndex'
], function (arrayCopy, isIndex) {
    var undefined;
    var nativeMin = Math.min;
    function reorder(array, indexes) {
        var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = arrayCopy(array);
        while (length--) {
            var index = indexes[length];
            array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
        }
        return array;
    }
    return reorder;
});