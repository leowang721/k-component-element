define('lodash/internal/isIterateeCall', [
    './isArrayLike',
    './isIndex',
    '../lang/isObject'
], function (isArrayLike, isIndex, isObject) {
    function isIterateeCall(value, index, object) {
        if (!isObject(object)) {
            return false;
        }
        var type = typeof index;
        if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
            var other = object[index];
            return value === value ? value === other : other !== other;
        }
        return false;
    }
    return isIterateeCall;
});