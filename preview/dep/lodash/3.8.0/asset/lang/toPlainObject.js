define('lodash/lang/toPlainObject', [
    '../internal/baseCopy',
    '../object/keysIn'
], function (baseCopy, keysIn) {
    function toPlainObject(value) {
        return baseCopy(value, keysIn(value));
    }
    return toPlainObject;
});