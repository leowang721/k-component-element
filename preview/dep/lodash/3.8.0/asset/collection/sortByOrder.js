define('lodash/collection/sortByOrder', [
    '../internal/baseSortByOrder',
    '../lang/isArray',
    '../internal/isIterateeCall'
], function (baseSortByOrder, isArray, isIterateeCall) {
    function sortByOrder(collection, iteratees, orders, guard) {
        if (collection == null) {
            return [];
        }
        if (guard && isIterateeCall(iteratees, orders, guard)) {
            orders = null;
        }
        if (!isArray(iteratees)) {
            iteratees = iteratees == null ? [] : [iteratees];
        }
        if (!isArray(orders)) {
            orders = orders == null ? [] : [orders];
        }
        return baseSortByOrder(collection, iteratees, orders);
    }
    return sortByOrder;
});