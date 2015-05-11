define('lodash/array/pullAt', [
    '../internal/baseAt',
    '../internal/baseCompareAscending',
    '../internal/baseFlatten',
    '../internal/basePullAt',
    '../function/restParam'
], function (baseAt, baseCompareAscending, baseFlatten, basePullAt, restParam) {
    var pullAt = restParam(function (array, indexes) {
            indexes = baseFlatten(indexes);
            var result = baseAt(array, indexes);
            basePullAt(array, indexes.sort(baseCompareAscending));
            return result;
        });
    return pullAt;
});