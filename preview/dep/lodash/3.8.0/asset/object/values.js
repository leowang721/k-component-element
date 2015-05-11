define('lodash/object/values', [
    '../internal/baseValues',
    './keys'
], function (baseValues, keys) {
    function values(object) {
        return baseValues(object, keys(object));
    }
    return values;
});