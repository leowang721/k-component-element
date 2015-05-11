define('lodash/internal/baseFlatten', [
    '../lang/isArguments',
    '../lang/isArray',
    './isArrayLike',
    './isObjectLike'
], function (isArguments, isArray, isArrayLike, isObjectLike) {
    function baseFlatten(array, isDeep, isStrict) {
        var index = -1, length = array.length, resIndex = -1, result = [];
        while (++index < length) {
            var value = array[index];
            if (isObjectLike(value) && isArrayLike(value) && (isStrict || isArray(value) || isArguments(value))) {
                if (isDeep) {
                    value = baseFlatten(value, isDeep, isStrict);
                }
                var valIndex = -1, valLength = value.length;
                while (++valIndex < valLength) {
                    result[++resIndex] = value[valIndex];
                }
            } else if (!isStrict) {
                result[++resIndex] = value;
            }
        }
        return result;
    }
    return baseFlatten;
});