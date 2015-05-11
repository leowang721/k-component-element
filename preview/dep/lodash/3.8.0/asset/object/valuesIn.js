define('lodash/object/valuesIn', [
    '../internal/baseValues',
    './keysIn'
], function (baseValues, keysIn) {
    function valuesIn(object) {
        return baseValues(object, keysIn(object));
    }
    return valuesIn;
});