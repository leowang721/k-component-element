define('lodash/utility/callback', [
    '../internal/baseCallback',
    '../internal/isIterateeCall',
    '../internal/isObjectLike',
    './matches'
], function (baseCallback, isIterateeCall, isObjectLike, matches) {
    function callback(func, thisArg, guard) {
        if (guard && isIterateeCall(func, thisArg, guard)) {
            thisArg = null;
        }
        return isObjectLike(func) ? matches(func) : baseCallback(func, thisArg);
    }
    return callback;
});