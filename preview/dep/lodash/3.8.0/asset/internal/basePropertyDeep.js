define('lodash/internal/basePropertyDeep', [
    './baseGet',
    './toPath'
], function (baseGet, toPath) {
    function basePropertyDeep(path) {
        var pathKey = path + '';
        path = toPath(path);
        return function (object) {
            return baseGet(object, path, pathKey);
        };
    }
    return basePropertyDeep;
});