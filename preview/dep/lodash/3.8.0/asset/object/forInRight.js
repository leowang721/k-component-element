define('lodash/object/forInRight', [
    '../internal/baseForRight',
    '../internal/createForIn'
], function (baseForRight, createForIn) {
    var forInRight = createForIn(baseForRight);
    return forInRight;
});