define('lodash/internal/isObjectLike', [], function () {
    function isObjectLike(value) {
        return !!value && typeof value == 'object';
    }
    return isObjectLike;
});