define('lodash/object/keys', [
    '../internal/isArrayLike',
    '../lang/isNative',
    '../lang/isObject',
    '../internal/shimKeys'
], function (isArrayLike, isNative, isObject, shimKeys) {
    var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;
    var keys = !nativeKeys ? shimKeys : function (object) {
            var Ctor = object != null && object.constructor;
            if (typeof Ctor == 'function' && Ctor.prototype === object || typeof object != 'function' && isArrayLike(object)) {
                return shimKeys(object);
            }
            return isObject(object) ? nativeKeys(object) : [];
        };
    return keys;
});