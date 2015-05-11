define('lodash/function/delay', [
    '../internal/baseDelay',
    './restParam'
], function (baseDelay, restParam) {
    var delay = restParam(function (func, wait, args) {
            return baseDelay(func, wait, args);
        });
    return delay;
});