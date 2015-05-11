define('lodash/collection/some', [
    '../internal/arraySome',
    '../internal/baseCallback',
    '../internal/baseSome',
    '../lang/isArray',
    '../internal/isIterateeCall'
], function (arraySome, baseCallback, baseSome, isArray, isIterateeCall) {
    var undefined;
    function some(collection, predicate, thisArg) {
        var func = isArray(collection) ? arraySome : baseSome;
        if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
            predicate = null;
        }
        if (typeof predicate != 'function' || thisArg !== undefined) {
            predicate = baseCallback(predicate, thisArg, 3);
        }
        return func(collection, predicate);
    }
    return some;
});