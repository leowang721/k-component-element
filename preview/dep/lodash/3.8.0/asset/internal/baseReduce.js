define('lodash/internal/baseReduce', [], function () {
    function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
        eachFunc(collection, function (value, index, collection) {
            accumulator = initFromCollection ? (initFromCollection = false, value) : iteratee(accumulator, value, index, collection);
        });
        return accumulator;
    }
    return baseReduce;
});