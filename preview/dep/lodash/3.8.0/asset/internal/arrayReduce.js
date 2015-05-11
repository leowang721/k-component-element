define('lodash/internal/arrayReduce', [], function () {
    function arrayReduce(array, iteratee, accumulator, initFromArray) {
        var index = -1, length = array.length;
        if (initFromArray && length) {
            accumulator = array[++index];
        }
        while (++index < length) {
            accumulator = iteratee(accumulator, array[index], index, array);
        }
        return accumulator;
    }
    return arrayReduce;
});