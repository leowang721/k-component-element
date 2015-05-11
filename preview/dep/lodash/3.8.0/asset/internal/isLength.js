define('lodash/internal/isLength', [], function () {
    var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
    function isLength(value) {
        return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    return isLength;
});