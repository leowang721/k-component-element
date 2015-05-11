define('lodash/internal/createForEach', [
    './bindCallback',
    '../lang/isArray'
], function (bindCallback, isArray) {
    var undefined;
    function createForEach(arrayFunc, eachFunc) {
        return function (collection, iteratee, thisArg) {
            return typeof iteratee == 'function' && thisArg === undefined && isArray(collection) ? arrayFunc(collection, iteratee) : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
        };
    }
    return createForEach;
});