define('lodash/collection/where', [
    '../internal/baseMatches',
    './filter'
], function (baseMatches, filter) {
    function where(collection, source) {
        return filter(collection, baseMatches(source));
    }
    return where;
});