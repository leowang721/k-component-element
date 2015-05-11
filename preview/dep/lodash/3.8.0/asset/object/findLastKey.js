define('lodash/object/findLastKey', [
    '../internal/baseForOwnRight',
    '../internal/createFindKey'
], function (baseForOwnRight, createFindKey) {
    var findLastKey = createFindKey(baseForOwnRight);
    return findLastKey;
});