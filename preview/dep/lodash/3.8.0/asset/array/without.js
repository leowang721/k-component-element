define('lodash/array/without', [
    '../internal/baseDifference',
    '../internal/isArrayLike',
    '../function/restParam'
], function (baseDifference, isArrayLike, restParam) {
    var without = restParam(function (array, values) {
            return isArrayLike(array) ? baseDifference(array, values) : [];
        });
    return without;
});