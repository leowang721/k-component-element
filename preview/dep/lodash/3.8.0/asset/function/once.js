define('lodash/function/once', ['./before'], function (before) {
    function once(func) {
        return before(2, func);
    }
    return once;
});