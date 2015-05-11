define('lodash/collection/at', [
    '../internal/baseAt',
    '../internal/baseFlatten',
    '../function/restParam'
], function (baseAt, baseFlatten, restParam) {
    var at = restParam(function (collection, props) {
            return baseAt(collection, baseFlatten(props));
        });
    return at;
});