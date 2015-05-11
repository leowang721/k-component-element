define('lodash/internal/baseProperty', [], function () {
    var undefined;
    function baseProperty(key) {
        return function (object) {
            return object == null ? undefined : object[key];
        };
    }
    return baseProperty;
});