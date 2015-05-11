define('lodash/collection/invoke', [
    '../internal/baseEach',
    '../internal/invokePath',
    '../internal/isArrayLike',
    '../internal/isKey',
    '../function/restParam'
], function (baseEach, invokePath, isArrayLike, isKey, restParam) {
    var invoke = restParam(function (collection, path, args) {
            var index = -1, isFunc = typeof path == 'function', isProp = isKey(path), result = isArrayLike(collection) ? Array(collection.length) : [];
            baseEach(collection, function (value) {
                var func = isFunc ? path : isProp && value != null && value[path];
                result[++index] = func ? func.apply(value, args) : invokePath(value, path, args);
            });
            return result;
        });
    return invoke;
});