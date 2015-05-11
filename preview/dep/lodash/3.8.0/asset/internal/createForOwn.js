define('lodash/internal/createForOwn', ['./bindCallback'], function (bindCallback) {
    var undefined;
    function createForOwn(objectFunc) {
        return function (object, iteratee, thisArg) {
            if (typeof iteratee != 'function' || thisArg !== undefined) {
                iteratee = bindCallback(iteratee, thisArg, 3);
            }
            return objectFunc(object, iteratee);
        };
    }
    return createForOwn;
});