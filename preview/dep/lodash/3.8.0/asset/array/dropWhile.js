define('lodash/array/dropWhile', [
    '../internal/baseCallback',
    '../internal/baseWhile'
], function (baseCallback, baseWhile) {
    function dropWhile(array, predicate, thisArg) {
        return array && array.length ? baseWhile(array, baseCallback(predicate, thisArg, 3), true) : [];
    }
    return dropWhile;
});