define('lodash/internal/toIterable', [
    './isArrayLike',
    '../lang/isObject',
    '../object/values'
], function (isArrayLike, isObject, values) {
    function toIterable(value) {
        if (value == null) {
            return [];
        }
        if (!isArrayLike(value)) {
            return values(value);
        }
        return isObject(value) ? value : Object(value);
    }
    return toIterable;
});