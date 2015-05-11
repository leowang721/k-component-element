define('lodash/collection/partition', ['../internal/createAggregator'], function (createAggregator) {
    var partition = createAggregator(function (result, value, key) {
            result[key ? 0 : 1].push(value);
        }, function () {
            return [
                [],
                []
            ];
        });
    return partition;
});