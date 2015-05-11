define('lodash/internal/createSortedIndex', [
    './baseCallback',
    './binaryIndex',
    './binaryIndexBy'
], function (baseCallback, binaryIndex, binaryIndexBy) {
    function createSortedIndex(retHighest) {
        return function (array, value, iteratee, thisArg) {
            return iteratee == null ? binaryIndex(array, value, retHighest) : binaryIndexBy(array, value, baseCallback(iteratee, thisArg, 1), retHighest);
        };
    }
    return createSortedIndex;
});