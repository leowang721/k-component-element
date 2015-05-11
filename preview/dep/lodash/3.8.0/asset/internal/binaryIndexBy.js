define('lodash/internal/binaryIndexBy', [], function () {
    var undefined;
    var floor = Math.floor;
    var nativeMin = Math.min;
    var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1;
    function binaryIndexBy(array, value, iteratee, retHighest) {
        value = iteratee(value);
        var low = 0, high = array ? array.length : 0, valIsNaN = value !== value, valIsUndef = value === undefined;
        while (low < high) {
            var mid = floor((low + high) / 2), computed = iteratee(array[mid]), isReflexive = computed === computed;
            if (valIsNaN) {
                var setLow = isReflexive || retHighest;
            } else if (valIsUndef) {
                setLow = isReflexive && (retHighest || computed !== undefined);
            } else {
                setLow = retHighest ? computed <= value : computed < value;
            }
            if (setLow) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return nativeMin(high, MAX_ARRAY_INDEX);
    }
    return binaryIndexBy;
});