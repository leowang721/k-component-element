define('lodash/internal/assignDefaults', [], function () {
    var undefined;
    function assignDefaults(objectValue, sourceValue) {
        return objectValue === undefined ? sourceValue : objectValue;
    }
    return assignDefaults;
});