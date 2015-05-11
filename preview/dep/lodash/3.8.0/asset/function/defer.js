define('lodash/function/defer', [
    '../internal/baseDelay',
    './restParam'
], function (baseDelay, restParam) {
    var defer = restParam(function (func, args) {
            return baseDelay(func, 1, args);
        });
    return defer;
});