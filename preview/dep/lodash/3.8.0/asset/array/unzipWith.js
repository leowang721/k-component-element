define('lodash/array/unzipWith', [
    '../internal/arrayMap',
    '../internal/arrayReduce',
    '../internal/bindCallback',
    './unzip'
], function (arrayMap, arrayReduce, bindCallback, unzip) {
    var undefined;
    function unzipWith(array, iteratee, thisArg) {
        var length = array ? array.length : 0;
        if (!length) {
            return [];
        }
        var result = unzip(array);
        if (iteratee == null) {
            return result;
        }
        iteratee = bindCallback(iteratee, thisArg, 4);
        return arrayMap(result, function (group) {
            return arrayReduce(group, iteratee, undefined, true);
        });
    }
    return unzipWith;
});