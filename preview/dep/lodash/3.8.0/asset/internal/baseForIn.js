define('lodash/internal/baseForIn', [
    './baseFor',
    '../object/keysIn'
], function (baseFor, keysIn) {
    function baseForIn(object, iteratee) {
        return baseFor(object, iteratee, keysIn);
    }
    return baseForIn;
});