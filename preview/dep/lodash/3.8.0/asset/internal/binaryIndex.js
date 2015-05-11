define('lodash/internal/binaryIndex', [
    './binaryIndexBy',
    '../utility/identity'
], function (binaryIndexBy, identity) {
    var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
    function binaryIndex(array, value, retHighest) {
        var low = 0, high = array ? array.length : low;
        if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
            while (low < high) {
                var mid = low + high >>> 1, computed = array[mid];
                if (retHighest ? computed <= value : computed < value) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
            return high;
        }
        return binaryIndexBy(array, value, identity, retHighest);
    }
    return binaryIndex;
});