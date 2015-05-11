define('lodash/internal/shimKeys', [
    '../lang/isArguments',
    '../lang/isArray',
    './isIndex',
    './isLength',
    '../object/keysIn',
    '../support'
], function (isArguments, isArray, isIndex, isLength, keysIn, support) {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function shimKeys(object) {
        var props = keysIn(object), propsLength = props.length, length = propsLength && object.length;
        var allowIndexes = length && isLength(length) && (isArray(object) || support.nonEnumArgs && isArguments(object));
        var index = -1, result = [];
        while (++index < propsLength) {
            var key = props[index];
            if (allowIndexes && isIndex(key, length) || hasOwnProperty.call(object, key)) {
                result.push(key);
            }
        }
        return result;
    }
    return shimKeys;
});