define('lodash/array/compact', [], function () {
    function compact(array) {
        var index = -1, length = array ? array.length : 0, resIndex = -1, result = [];
        while (++index < length) {
            var value = array[index];
            if (value) {
                result[++resIndex] = value;
            }
        }
        return result;
    }
    return compact;
});