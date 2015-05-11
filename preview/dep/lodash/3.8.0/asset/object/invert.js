define('lodash/object/invert', [
    '../internal/isIterateeCall',
    './keys'
], function (isIterateeCall, keys) {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function invert(object, multiValue, guard) {
        if (guard && isIterateeCall(object, multiValue, guard)) {
            multiValue = null;
        }
        var index = -1, props = keys(object), length = props.length, result = {};
        while (++index < length) {
            var key = props[index], value = object[key];
            if (multiValue) {
                if (hasOwnProperty.call(result, value)) {
                    result[value].push(key);
                } else {
                    result[value] = [key];
                }
            } else {
                result[value] = key;
            }
        }
        return result;
    }
    return invert;
});