define('lodash/lang/isNumber', ['../internal/isObjectLike'], function (isObjectLike) {
    var numberTag = '[object Number]';
    var objectProto = Object.prototype;
    var objToString = objectProto.toString;
    function isNumber(value) {
        return typeof value == 'number' || isObjectLike(value) && objToString.call(value) == numberTag;
    }
    return isNumber;
});