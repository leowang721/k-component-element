define('lodash/internal/baseIsFunction', [], function () {
    function baseIsFunction(value) {
        return typeof value == 'function' || false;
    }
    return baseIsFunction;
});