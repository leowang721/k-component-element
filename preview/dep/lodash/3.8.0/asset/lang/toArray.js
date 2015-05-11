define('lodash/lang/toArray', [
    '../internal/arrayCopy',
    '../internal/getLength',
    '../internal/isLength',
    '../object/values'
], function (arrayCopy, getLength, isLength, values) {
    function toArray(value) {
        var length = value ? getLength(value) : 0;
        if (!isLength(length)) {
            return values(value);
        }
        if (!length) {
            return [];
        }
        return arrayCopy(value);
    }
    return toArray;
});