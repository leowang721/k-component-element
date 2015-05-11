define('lodash/function/negate', [], function () {
    var FUNC_ERROR_TEXT = 'Expected a function';
    function negate(predicate) {
        if (typeof predicate != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
        }
        return function () {
            return !predicate.apply(this, arguments);
        };
    }
    return negate;
});