define('lodash/internal/shimIsPlainObject', [
    './baseForIn',
    './isObjectLike'
], function (baseForIn, isObjectLike) {
    var undefined;
    var objectTag = '[object Object]';
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objToString = objectProto.toString;
    function shimIsPlainObject(value) {
        var Ctor;
        if (!(isObjectLike(value) && objToString.call(value) == objectTag) || !hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor))) {
            return false;
        }
        var result;
        baseForIn(value, function (subValue, key) {
            result = key;
        });
        return result === undefined || hasOwnProperty.call(value, result);
    }
    return shimIsPlainObject;
});