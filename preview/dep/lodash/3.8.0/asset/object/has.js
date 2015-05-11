define('lodash/object/has', [
    '../internal/baseGet',
    '../internal/baseSlice',
    '../internal/isKey',
    '../array/last',
    '../internal/toPath'
], function (baseGet, baseSlice, isKey, last, toPath) {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function has(object, path) {
        if (object == null) {
            return false;
        }
        var result = hasOwnProperty.call(object, path);
        if (!result && !isKey(path)) {
            path = toPath(path);
            object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
            path = last(path);
            result = object != null && hasOwnProperty.call(object, path);
        }
        return result;
    }
    return has;
});