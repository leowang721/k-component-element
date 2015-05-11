define('lodash/function/partialRight', ['../internal/createPartial'], function (createPartial) {
    var PARTIAL_RIGHT_FLAG = 64;
    var partialRight = createPartial(PARTIAL_RIGHT_FLAG);
    partialRight.placeholder = {};
    return partialRight;
});