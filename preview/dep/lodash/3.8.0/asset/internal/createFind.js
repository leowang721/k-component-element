define('lodash/internal/createFind', [
    './baseCallback',
    './baseFind',
    './baseFindIndex',
    '../lang/isArray'
], function (baseCallback, baseFind, baseFindIndex, isArray) {
    var undefined;
    function createFind(eachFunc, fromRight) {
        return function (collection, predicate, thisArg) {
            predicate = baseCallback(predicate, thisArg, 3);
            if (isArray(collection)) {
                var index = baseFindIndex(collection, predicate, fromRight);
                return index > -1 ? collection[index] : undefined;
            }
            return baseFind(collection, predicate, eachFunc);
        };
    }
    return createFind;
});