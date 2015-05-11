define('lodash/function/after', ['../internal/root'], function (root) {
    var FUNC_ERROR_TEXT = 'Expected a function';
    var nativeIsFinite = root.isFinite;
    function after(n, func) {
        if (typeof func != 'function') {
            if (typeof n == 'function') {
                var temp = n;
                n = func;
                func = temp;
            } else {
                throw new TypeError(FUNC_ERROR_TEXT);
            }
        }
        n = nativeIsFinite(n = +n) ? n : 0;
        return function () {
            if (--n < 1) {
                return func.apply(this, arguments);
            }
        };
    }
    return after;
});