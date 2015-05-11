define('lodash/internal/sortedUniq', [], function () {
    function sortedUniq(array, iteratee) {
        var seen, index = -1, length = array.length, resIndex = -1, result = [];
        while (++index < length) {
            var value = array[index], computed = iteratee ? iteratee(value, index, array) : value;
            if (!index || seen !== computed) {
                seen = computed;
                result[++resIndex] = value;
            }
        }
        return result;
    }
    return sortedUniq;
});