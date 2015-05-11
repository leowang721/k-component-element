define('lodash/object/forOwnRight', [
    '../internal/baseForOwnRight',
    '../internal/createForOwn'
], function (baseForOwnRight, createForOwn) {
    var forOwnRight = createForOwn(baseForOwnRight);
    return forOwnRight;
});