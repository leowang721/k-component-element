define('lodash/math/max', [
    '../internal/arrayMax',
    '../internal/createExtremum'
], function (arrayMax, createExtremum) {
    var max = createExtremum(arrayMax);
    return max;
});