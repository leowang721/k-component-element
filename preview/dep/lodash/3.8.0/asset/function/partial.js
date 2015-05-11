define('lodash/function/partial', ['../internal/createPartial'], function (createPartial) {
    var PARTIAL_FLAG = 32;
    var partial = createPartial(PARTIAL_FLAG);
    partial.placeholder = {};
    return partial;
});