define('lodash/internal/pickByCallback', ['./baseForIn'], function (baseForIn) {
    function pickByCallback(object, predicate) {
        var result = {};
        baseForIn(object, function (value, key, object) {
            if (predicate(value, key, object)) {
                result[key] = value;
            }
        });
        return result;
    }
    return pickByCallback;
});