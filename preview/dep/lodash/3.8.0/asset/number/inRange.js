define('lodash/number/inRange', [], function () {
    var nativeMax = Math.max, nativeMin = Math.min;
    function inRange(value, start, end) {
        start = +start || 0;
        if (typeof end === 'undefined') {
            end = start;
            start = 0;
        } else {
            end = +end || 0;
        }
        return value >= nativeMin(start, end) && value < nativeMax(start, end);
    }
    return inRange;
});