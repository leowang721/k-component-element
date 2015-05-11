define('lodash/object/pairs', ['./keys'], function (keys) {
    function pairs(object) {
        var index = -1, props = keys(object), length = props.length, result = Array(length);
        while (++index < length) {
            var key = props[index];
            result[index] = [
                key,
                object[key]
            ];
        }
        return result;
    }
    return pairs;
});