define('lodash/collection/filter', [
    '../internal/arrayFilter',
    '../internal/baseCallback',
    '../internal/baseFilter',
    '../lang/isArray'
], function (arrayFilter, baseCallback, baseFilter, isArray) {
    function filter(collection, predicate, thisArg) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        predicate = baseCallback(predicate, thisArg, 3);
        return func(collection, predicate);
    }
    return filter;
});