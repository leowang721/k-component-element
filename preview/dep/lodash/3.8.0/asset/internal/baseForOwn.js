define('lodash/internal/baseForOwn', [
    './baseFor',
    '../object/keys'
], function (baseFor, keys) {
    function baseForOwn(object, iteratee) {
        return baseFor(object, iteratee, keys);
    }
    return baseForOwn;
});