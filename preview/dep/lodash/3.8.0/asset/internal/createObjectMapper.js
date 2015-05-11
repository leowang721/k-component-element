define('lodash/internal/createObjectMapper', [
    './baseCallback',
    './baseForOwn'
], function (baseCallback, baseForOwn) {
    function createObjectMapper(isMapKeys) {
        return function (object, iteratee, thisArg) {
            var result = {};
            iteratee = baseCallback(iteratee, thisArg, 3);
            baseForOwn(object, function (value, key, object) {
                var mapped = iteratee(value, key, object);
                key = isMapKeys ? mapped : key;
                value = isMapKeys ? value : mapped;
                result[key] = value;
            });
            return result;
        };
    }
    return createObjectMapper;
});