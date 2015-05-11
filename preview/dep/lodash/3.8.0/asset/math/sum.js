define('lodash/math/sum', [
    '../internal/arraySum',
    '../internal/baseCallback',
    '../internal/baseSum',
    '../lang/isArray',
    '../internal/isIterateeCall',
    '../internal/toIterable'
], function (arraySum, baseCallback, baseSum, isArray, isIterateeCall, toIterable) {
    function sum(collection, iteratee, thisArg) {
        if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
            iteratee = null;
        }
        var noIteratee = iteratee == null;
        iteratee = noIteratee ? iteratee : baseCallback(iteratee, thisArg, 3);
        return noIteratee ? arraySum(isArray(collection) ? collection : toIterable(collection)) : baseSum(collection, iteratee);
    }
    return sum;
});