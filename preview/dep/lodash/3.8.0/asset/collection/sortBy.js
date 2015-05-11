define('lodash/collection/sortBy', [
    '../internal/baseCallback',
    '../internal/baseMap',
    '../internal/baseSortBy',
    '../internal/compareAscending',
    '../internal/isIterateeCall'
], function (baseCallback, baseMap, baseSortBy, compareAscending, isIterateeCall) {
    function sortBy(collection, iteratee, thisArg) {
        if (collection == null) {
            return [];
        }
        if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
            iteratee = null;
        }
        var index = -1;
        iteratee = baseCallback(iteratee, thisArg, 3);
        var result = baseMap(collection, function (value, key, collection) {
                return {
                    'criteria': iteratee(value, key, collection),
                    'index': ++index,
                    'value': value
                };
            });
        return baseSortBy(result, compareAscending);
    }
    return sortBy;
});