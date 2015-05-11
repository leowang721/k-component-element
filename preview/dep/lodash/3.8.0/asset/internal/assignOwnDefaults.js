define('lodash/internal/assignOwnDefaults', [], function () {
    var undefined;
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function assignOwnDefaults(objectValue, sourceValue, key, object) {
        return objectValue === undefined || !hasOwnProperty.call(object, key) ? sourceValue : objectValue;
    }
    return assignOwnDefaults;
});