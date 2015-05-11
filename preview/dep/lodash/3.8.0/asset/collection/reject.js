define('lodash/collection/reject', [
    '../internal/arrayFilter',
    '../internal/baseCallback',
    '../internal/baseFilter',
    '../lang/isArray'
], function (arrayFilter, baseCallback, baseFilter, isArray) {
    function reject(collection, predicate, thisArg) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        predicate = baseCallback(predicate, thisArg, 3);
        return func(collection, function (value, index, collection) {
            return !predicate(value, index, collection);
        });
    }
    return reject;
});