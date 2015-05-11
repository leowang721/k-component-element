define('lodash/function/rearg', [
    '../internal/baseFlatten',
    '../internal/createWrapper',
    './restParam'
], function (baseFlatten, createWrapper, restParam) {
    var REARG_FLAG = 256;
    var rearg = restParam(function (func, indexes) {
            return createWrapper(func, REARG_FLAG, null, null, null, baseFlatten(indexes));
        });
    return rearg;
});