define('lodash/math/min', [
    '../internal/arrayMin',
    '../internal/createExtremum'
], function (arrayMin, createExtremum) {
    var min = createExtremum(arrayMin, true);
    return min;
});