define('lodash/array/flattenDeep', ['../internal/baseFlatten'], function (baseFlatten) {
    function flattenDeep(array) {
        var length = array ? array.length : 0;
        return length ? baseFlatten(array, true) : [];
    }
    return flattenDeep;
});