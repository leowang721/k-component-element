define('lodash/utility/method', [
    '../internal/invokePath',
    '../function/restParam'
], function (invokePath, restParam) {
    var method = restParam(function (path, args) {
            return function (object) {
                return invokePath(object, path, args);
            };
        });
    return method;
});