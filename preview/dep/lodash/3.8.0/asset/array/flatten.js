define('lodash/array/flatten', [
    '../internal/baseFlatten',
    '../internal/isIterateeCall'
], function (baseFlatten, isIterateeCall) {
    function flatten(array, isDeep, guard) {
        var length = array ? array.length : 0;
        if (guard && isIterateeCall(array, isDeep, guard)) {
            isDeep = false;
        }
        return length ? baseFlatten(array, isDeep) : [];
    }
    return flatten;
});