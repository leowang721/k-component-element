define('lodash/internal/baseFind', [], function () {
    function baseFind(collection, predicate, eachFunc, retKey) {
        var result;
        eachFunc(collection, function (value, key, collection) {
            if (predicate(value, key, collection)) {
                result = retKey ? key : value;
                return false;
            }
        });
        return result;
    }
    return baseFind;
});