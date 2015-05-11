define('lodash/internal/arraySum', [], function () {
    function arraySum(array) {
        var length = array.length, result = 0;
        while (length--) {
            result += +array[length] || 0;
        }
        return result;
    }
    return arraySum;
});