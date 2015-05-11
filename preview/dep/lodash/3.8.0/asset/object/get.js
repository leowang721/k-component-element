define('lodash/object/get', [
    '../internal/baseGet',
    '../internal/toPath'
], function (baseGet, toPath) {
    var undefined;
    function get(object, path, defaultValue) {
        var result = object == null ? undefined : baseGet(object, toPath(path), path + '');
        return result === undefined ? defaultValue : result;
    }
    return get;
});