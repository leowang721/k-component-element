define('lodash/object/mapKeys', ['../internal/createObjectMapper'], function (createObjectMapper) {
    var mapKeys = createObjectMapper(true);
    return mapKeys;
});