define('lodash/array/last', [], function () {
    var undefined;
    function last(array) {
        var length = array ? array.length : 0;
        return length ? array[length - 1] : undefined;
    }
    return last;
});