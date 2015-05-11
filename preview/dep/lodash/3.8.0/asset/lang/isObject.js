define('lodash/lang/isObject', [], function () {
    function isObject(value) {
        var type = typeof value;
        return type == 'function' || !!value && type == 'object';
    }
    return isObject;
});