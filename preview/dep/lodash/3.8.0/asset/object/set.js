define('lodash/object/set', [
    '../internal/isIndex',
    '../internal/isKey',
    '../lang/isObject',
    '../internal/toPath'
], function (isIndex, isKey, isObject, toPath) {
    function set(object, path, value) {
        if (object == null) {
            return object;
        }
        var pathKey = path + '';
        path = object[pathKey] != null || isKey(path, object) ? [pathKey] : toPath(path);
        var index = -1, length = path.length, endIndex = length - 1, nested = object;
        while (nested != null && ++index < length) {
            var key = path[index];
            if (isObject(nested)) {
                if (index == endIndex) {
                    nested[key] = value;
                } else if (nested[key] == null) {
                    nested[key] = isIndex(path[index + 1]) ? [] : {};
                }
            }
            nested = nested[key];
        }
        return object;
    }
    return set;
});