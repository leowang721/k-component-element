define('lodash/internal/baseSortByOrder', [
    './arrayMap',
    './baseCallback',
    './baseMap',
    './baseSortBy',
    './compareMultiple'
], function (arrayMap, baseCallback, baseMap, baseSortBy, compareMultiple) {
    function baseSortByOrder(collection, iteratees, orders) {
        var index = -1;
        iteratees = arrayMap(iteratees, function (iteratee) {
            return baseCallback(iteratee);
        });
        var result = baseMap(collection, function (value) {
                var criteria = arrayMap(iteratees, function (iteratee) {
                        return iteratee(value);
                    });
                return {
                    'criteria': criteria,
                    'index': ++index,
                    'value': value
                };
            });
        return baseSortBy(result, function (object, other) {
            return compareMultiple(object, other, orders);
        });
    }
    return baseSortByOrder;
});