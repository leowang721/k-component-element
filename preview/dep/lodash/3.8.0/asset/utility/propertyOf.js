define('lodash/utility/propertyOf', [
    '../internal/baseGet',
    '../internal/toPath'
], function (baseGet, toPath) {
    function propertyOf(object) {
        return function (path) {
            return baseGet(object, toPath(path), path + '');
        };
    }
    return propertyOf;
});