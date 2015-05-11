define('lodash/array/difference', [
    '../internal/baseDifference',
    '../internal/baseFlatten',
    '../internal/isArrayLike',
    '../function/restParam'
], function (baseDifference, baseFlatten, isArrayLike, restParam) {
    var difference = restParam(function (array, values) {
            return isArrayLike(array) ? baseDifference(array, baseFlatten(values, false, true)) : [];
        });
    return difference;
});