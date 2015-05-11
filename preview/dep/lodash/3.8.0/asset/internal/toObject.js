define('lodash/internal/toObject', ['../lang/isObject'], function (isObject) {
    function toObject(value) {
        return isObject(value) ? value : Object(value);
    }
    return toObject;
});