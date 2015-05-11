define('lodash/internal/isArrayLike', [
    './getLength',
    './isLength'
], function (getLength, isLength) {
    function isArrayLike(value) {
        return value != null && isLength(getLength(value));
    }
    return isArrayLike;
});