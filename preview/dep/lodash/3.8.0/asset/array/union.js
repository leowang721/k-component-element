define('lodash/array/union', [
    '../internal/baseFlatten',
    '../internal/baseUniq',
    '../function/restParam'
], function (baseFlatten, baseUniq, restParam) {
    var union = restParam(function (arrays) {
            return baseUniq(baseFlatten(arrays, false, true));
        });
    return union;
});