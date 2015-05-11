define('lodash/utility/property', [
    '../internal/baseProperty',
    '../internal/basePropertyDeep',
    '../internal/isKey'
], function (baseProperty, basePropertyDeep, isKey) {
    function property(path) {
        return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
    }
    return property;
});