define('lodash/internal/baseFilter', ['./baseEach'], function (baseEach) {
    function baseFilter(collection, predicate) {
        var result = [];
        baseEach(collection, function (value, index, collection) {
            if (predicate(value, index, collection)) {
                result.push(value);
            }
        });
        return result;
    }
    return baseFilter;
});