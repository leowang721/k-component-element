define('lodash/array/uniq', [
    '../internal/baseCallback',
    '../internal/baseUniq',
    '../internal/isIterateeCall',
    '../internal/sortedUniq'
], function (baseCallback, baseUniq, isIterateeCall, sortedUniq) {
    function uniq(array, isSorted, iteratee, thisArg) {
        var length = array ? array.length : 0;
        if (!length) {
            return [];
        }
        if (isSorted != null && typeof isSorted != 'boolean') {
            thisArg = iteratee;
            iteratee = isIterateeCall(array, isSorted, thisArg) ? null : isSorted;
            isSorted = false;
        }
        iteratee = iteratee == null ? iteratee : baseCallback(iteratee, thisArg, 3);
        return isSorted ? sortedUniq(array, iteratee) : baseUniq(array, iteratee);
    }
    return uniq;
});