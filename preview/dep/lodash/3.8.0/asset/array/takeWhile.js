define('lodash/array/takeWhile', [
    '../internal/baseCallback',
    '../internal/baseWhile'
], function (baseCallback, baseWhile) {
    function takeWhile(array, predicate, thisArg) {
        return array && array.length ? baseWhile(array, baseCallback(predicate, thisArg, 3)) : [];
    }
    return takeWhile;
});