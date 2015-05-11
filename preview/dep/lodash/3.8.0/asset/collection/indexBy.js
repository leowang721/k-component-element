define('lodash/collection/indexBy', ['../internal/createAggregator'], function (createAggregator) {
    var indexBy = createAggregator(function (result, value, key) {
            result[key] = value;
        });
    return indexBy;
});