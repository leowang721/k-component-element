define('lodash/internal/invokePath', [
    './baseGet',
    './baseSlice',
    './isKey',
    '../array/last',
    './toPath'
], function (baseGet, baseSlice, isKey, last, toPath) {
    var undefined;
    function invokePath(object, path, args) {
        if (object != null && !isKey(path, object)) {
            path = toPath(path);
            object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
            path = last(path);
        }
        var func = object == null ? object : object[path];
        return func == null ? undefined : func.apply(object, args);
    }
    return invokePath;
});