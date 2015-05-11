define('lodash/object/functions', [
    '../internal/baseFunctions',
    './keysIn'
], function (baseFunctions, keysIn) {
    function functions(object) {
        return baseFunctions(object, keysIn(object));
    }
    return functions;
});