define('lodash/object/forOwn', [
    '../internal/baseForOwn',
    '../internal/createForOwn'
], function (baseForOwn, createForOwn) {
    var forOwn = createForOwn(baseForOwn);
    return forOwn;
});