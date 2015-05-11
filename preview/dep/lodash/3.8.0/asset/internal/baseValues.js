define('lodash/internal/baseValues', [], function () {
    function baseValues(object, props) {
        var index = -1, length = props.length, result = Array(length);
        while (++index < length) {
            result[index] = object[props[index]];
        }
        return result;
    }
    return baseValues;
});