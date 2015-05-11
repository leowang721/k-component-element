define('lodash/internal/baseForOwnRight', [
    './baseForRight',
    '../object/keys'
], function (baseForRight, keys) {
    function baseForOwnRight(object, iteratee) {
        return baseForRight(object, iteratee, keys);
    }
    return baseForOwnRight;
});