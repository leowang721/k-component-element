define('lodash/lang/isEmpty', [
    './isArguments',
    './isArray',
    '../internal/isArrayLike',
    './isFunction',
    '../internal/isObjectLike',
    './isString',
    '../object/keys'
], function (isArguments, isArray, isArrayLike, isFunction, isObjectLike, isString, keys) {
    function isEmpty(value) {
        if (value == null) {
            return true;
        }
        if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) || isObjectLike(value) && isFunction(value.splice))) {
            return !value.length;
        }
        return !keys(value).length;
    }
    return isEmpty;
});