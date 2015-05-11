define('lodash/collection/includes', [
    '../internal/baseIndexOf',
    '../internal/getLength',
    '../lang/isArray',
    '../internal/isIterateeCall',
    '../internal/isLength',
    '../lang/isString',
    '../object/values'
], function (baseIndexOf, getLength, isArray, isIterateeCall, isLength, isString, values) {
    var nativeMax = Math.max;
    function includes(collection, target, fromIndex, guard) {
        var length = collection ? getLength(collection) : 0;
        if (!isLength(length)) {
            collection = values(collection);
            length = collection.length;
        }
        if (!length) {
            return false;
        }
        if (typeof fromIndex != 'number' || guard && isIterateeCall(target, fromIndex, guard)) {
            fromIndex = 0;
        } else {
            fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex || 0;
        }
        return typeof collection == 'string' || !isArray(collection) && isString(collection) ? fromIndex < length && collection.indexOf(target, fromIndex) > -1 : baseIndexOf(collection, target, fromIndex) > -1;
    }
    return includes;
});