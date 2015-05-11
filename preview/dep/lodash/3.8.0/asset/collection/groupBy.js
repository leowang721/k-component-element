define('lodash/collection/groupBy', ['../internal/createAggregator'], function (createAggregator) {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var groupBy = createAggregator(function (result, value, key) {
            if (hasOwnProperty.call(result, key)) {
                result[key].push(value);
            } else {
                result[key] = [value];
            }
        });
    return groupBy;
});