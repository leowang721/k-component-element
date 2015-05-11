define('lodash/internal/createFindKey', [
    './baseCallback',
    './baseFind'
], function (baseCallback, baseFind) {
    function createFindKey(objectFunc) {
        return function (object, predicate, thisArg) {
            predicate = baseCallback(predicate, thisArg, 3);
            return baseFind(object, predicate, objectFunc, true);
        };
    }
    return createFindKey;
});