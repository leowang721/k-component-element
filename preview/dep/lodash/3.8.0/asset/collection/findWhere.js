define('lodash/collection/findWhere', [
    '../internal/baseMatches',
    './find'
], function (baseMatches, find) {
    function findWhere(collection, source) {
        return find(collection, baseMatches(source));
    }
    return findWhere;
});