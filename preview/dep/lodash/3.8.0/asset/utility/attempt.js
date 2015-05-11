define('lodash/utility/attempt', [
    '../lang/isError',
    '../function/restParam'
], function (isError, restParam) {
    var undefined;
    var attempt = restParam(function (func, args) {
            try {
                return func.apply(undefined, args);
            } catch (e) {
                return isError(e) ? e : new Error(e);
            }
        });
    return attempt;
});