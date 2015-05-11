define('lodash/collection/map', [
    '../internal/arrayMap',
    '../internal/baseCallback',
    '../internal/baseMap',
    '../lang/isArray'
], function (arrayMap, baseCallback, baseMap, isArray) {
    function map(collection, iteratee, thisArg) {
        var func = isArray(collection) ? arrayMap : baseMap;
        iteratee = baseCallback(iteratee, thisArg, 3);
        return func(collection, iteratee);
    }
    return map;
});