define('lodash/internal/baseEach', [
    './baseForOwn',
    './createBaseEach'
], function (baseForOwn, createBaseEach) {
    var baseEach = createBaseEach(baseForOwn);
    return baseEach;
});