define('lodash/collection/size', [
    '../internal/getLength',
    '../internal/isLength',
    '../object/keys'
], function (getLength, isLength, keys) {
    function size(collection) {
        var length = collection ? getLength(collection) : 0;
        return isLength(length) ? length : keys(collection).length;
    }
    return size;
});