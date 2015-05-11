define('lodash/object/findKey', [
    '../internal/baseForOwn',
    '../internal/createFindKey'
], function (baseForOwn, createFindKey) {
    var findKey = createFindKey(baseForOwn);
    return findKey;
});