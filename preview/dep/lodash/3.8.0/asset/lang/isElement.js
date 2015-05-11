define('lodash/lang/isElement', [
    '../internal/isObjectLike',
    './isPlainObject',
    '../support'
], function (isObjectLike, isPlainObject, support) {
    var objectProto = Object.prototype;
    var objToString = objectProto.toString;
    function isElement(value) {
        return !!value && value.nodeType === 1 && isObjectLike(value) && objToString.call(value).indexOf('Element') > -1;
    }
    if (!support.dom) {
        isElement = function (value) {
            return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
        };
    }
    return isElement;
});