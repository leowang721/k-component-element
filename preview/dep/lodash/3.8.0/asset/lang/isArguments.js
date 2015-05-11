define('lodash/lang/isArguments', [
    '../internal/isArrayLike',
    '../internal/isObjectLike'
], function (isArrayLike, isObjectLike) {
    var argsTag = '[object Arguments]';
    var objectProto = Object.prototype;
    var objToString = objectProto.toString;
    function isArguments(value) {
        return isObjectLike(value) && isArrayLike(value) && objToString.call(value) == argsTag;
    }
    return isArguments;
});