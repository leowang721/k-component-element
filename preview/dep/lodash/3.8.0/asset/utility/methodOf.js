define('lodash/utility/methodOf', [
    '../internal/invokePath',
    '../function/restParam'
], function (invokePath, restParam) {
    var methodOf = restParam(function (object, args) {
            return function (path) {
                return invokePath(object, path, args);
            };
        });
    return methodOf;
});