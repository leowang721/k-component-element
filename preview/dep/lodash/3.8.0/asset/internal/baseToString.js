define('lodash/internal/baseToString', [], function () {
    function baseToString(value) {
        if (typeof value == 'string') {
            return value;
        }
        return value == null ? '' : value + '';
    }
    return baseToString;
});