define('lodash/internal/baseSortBy', [], function () {
    function baseSortBy(array, comparer) {
        var length = array.length;
        array.sort(comparer);
        while (length--) {
            array[length] = array[length].value;
        }
        return array;
    }
    return baseSortBy;
});