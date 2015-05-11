define('lodash/function/spread', [], function () {
    var FUNC_ERROR_TEXT = 'Expected a function';
    function spread(func) {
        if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
        }
        return function (array) {
            return func.apply(this, array);
        };
    }
    return spread;
});