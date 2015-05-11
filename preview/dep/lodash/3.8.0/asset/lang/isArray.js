define('lodash/lang/isArray', [
    '../internal/isLength',
    './isNative',
    '../internal/isObjectLike'
], function (isLength, isNative, isObjectLike) {
    var arrayTag = '[object Array]';
    var objectProto = Object.prototype;
    var objToString = objectProto.toString;
    var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;
    var isArray = nativeIsArray || function (value) {
            return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
        };
    return isArray;
});