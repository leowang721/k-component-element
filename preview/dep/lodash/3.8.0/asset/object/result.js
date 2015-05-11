define('lodash/object/result', [
    '../internal/baseGet',
    '../internal/baseSlice',
    '../lang/isFunction',
    '../internal/isKey',
    '../array/last',
    '../internal/toPath'
], function (baseGet, baseSlice, isFunction, isKey, last, toPath) {
    var undefined;
    function result(object, path, defaultValue) {
        var result = object == null ? undefined : object[path];
        if (result === undefined) {
            if (object != null && !isKey(path, object)) {
                path = toPath(path);
                object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
                result = object == null ? undefined : object[last(path)];
            }
            result = result === undefined ? defaultValue : result;
        }
        return isFunction(result) ? result.call(object) : result;
    }
    return result;
});