define('lodash/internal/baseFunctions', ['../lang/isFunction'], function (isFunction) {
    function baseFunctions(object, props) {
        var index = -1, length = props.length, resIndex = -1, result = [];
        while (++index < length) {
            var key = props[index];
            if (isFunction(object[key])) {
                result[++resIndex] = key;
            }
        }
        return result;
    }
    return baseFunctions;
});