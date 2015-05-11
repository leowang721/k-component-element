define('lodash/internal/createForIn', [
    './bindCallback',
    '../object/keysIn'
], function (bindCallback, keysIn) {
    var undefined;
    function createForIn(objectFunc) {
        return function (object, iteratee, thisArg) {
            if (typeof iteratee != 'function' || thisArg !== undefined) {
                iteratee = bindCallback(iteratee, thisArg, 3);
            }
            return objectFunc(object, iteratee, keysIn);
        };
    }
    return createForIn;
});