define('lodash/internal/isIndex', [], function () {
    var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
    function isIndex(value, length) {
        value = +value;
        length = length == null ? MAX_SAFE_INTEGER : length;
        return value > -1 && value % 1 == 0 && value < length;
    }
    return isIndex;
});