define('lodash/internal/baseDelay', [], function () {
    var undefined;
    var FUNC_ERROR_TEXT = 'Expected a function';
    function baseDelay(func, wait, args) {
        if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
        }
        return setTimeout(function () {
            func.apply(undefined, args);
        }, wait);
    }
    return baseDelay;
});