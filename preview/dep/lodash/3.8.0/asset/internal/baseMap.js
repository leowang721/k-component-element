define('lodash/internal/baseMap', [
    './baseEach',
    './isArrayLike'
], function (baseEach, isArrayLike) {
    function baseMap(collection, iteratee) {
        var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
        baseEach(collection, function (value, key, collection) {
            result[++index] = iteratee(value, key, collection);
        });
        return result;
    }
    return baseMap;
});