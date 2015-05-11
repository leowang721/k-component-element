define('lodash/internal/createFindIndex', [
    './baseCallback',
    './baseFindIndex'
], function (baseCallback, baseFindIndex) {
    function createFindIndex(fromRight) {
        return function (array, predicate, thisArg) {
            if (!(array && array.length)) {
                return -1;
            }
            predicate = baseCallback(predicate, thisArg, 3);
            return baseFindIndex(array, predicate, fromRight);
        };
    }
    return createFindIndex;
});