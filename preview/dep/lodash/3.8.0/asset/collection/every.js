define('lodash/collection/every', [
    '../internal/arrayEvery',
    '../internal/baseCallback',
    '../internal/baseEvery',
    '../lang/isArray',
    '../internal/isIterateeCall'
], function (arrayEvery, baseCallback, baseEvery, isArray, isIterateeCall) {
    var undefined;
    function every(collection, predicate, thisArg) {
        var func = isArray(collection) ? arrayEvery : baseEvery;
        if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
            predicate = null;
        }
        if (typeof predicate != 'function' || thisArg !== undefined) {
            predicate = baseCallback(predicate, thisArg, 3);
        }
        return func(collection, predicate);
    }
    return every;
});