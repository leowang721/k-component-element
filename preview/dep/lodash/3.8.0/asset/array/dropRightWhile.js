define('lodash/array/dropRightWhile', [
    '../internal/baseCallback',
    '../internal/baseWhile'
], function (baseCallback, baseWhile) {
    function dropRightWhile(array, predicate, thisArg) {
        return array && array.length ? baseWhile(array, baseCallback(predicate, thisArg, 3), true, true) : [];
    }
    return dropRightWhile;
});