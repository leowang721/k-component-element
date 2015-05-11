define('lodash/array/xor', [
    '../internal/baseDifference',
    '../internal/baseUniq',
    '../internal/isArrayLike'
], function (baseDifference, baseUniq, isArrayLike) {
    function xor() {
        var index = -1, length = arguments.length;
        while (++index < length) {
            var array = arguments[index];
            if (isArrayLike(array)) {
                var result = result ? baseDifference(result, array).concat(baseDifference(array, result)) : array;
            }
        }
        return result ? baseUniq(result) : [];
    }
    return xor;
});