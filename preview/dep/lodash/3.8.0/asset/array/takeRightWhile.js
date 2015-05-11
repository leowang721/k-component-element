define('lodash/array/takeRightWhile', [
    '../internal/baseCallback',
    '../internal/baseWhile'
], function (baseCallback, baseWhile) {
    function takeRightWhile(array, predicate, thisArg) {
        return array && array.length ? baseWhile(array, baseCallback(predicate, thisArg, 3), false, true) : [];
    }
    return takeRightWhile;
});