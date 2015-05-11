define('lodash/object/create', [
    '../internal/baseAssign',
    '../internal/baseCreate',
    '../internal/isIterateeCall'
], function (baseAssign, baseCreate, isIterateeCall) {
    function create(prototype, properties, guard) {
        var result = baseCreate(prototype);
        if (guard && isIterateeCall(prototype, properties, guard)) {
            properties = null;
        }
        return properties ? baseAssign(result, properties) : result;
    }
    return create;
});