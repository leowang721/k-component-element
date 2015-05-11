define('lodash/internal/baseCallback', [
    './baseMatches',
    './baseMatchesProperty',
    './bindCallback',
    '../utility/identity',
    '../utility/property'
], function (baseMatches, baseMatchesProperty, bindCallback, identity, property) {
    var undefined;
    function baseCallback(func, thisArg, argCount) {
        var type = typeof func;
        if (type == 'function') {
            return thisArg === undefined ? func : bindCallback(func, thisArg, argCount);
        }
        if (func == null) {
            return identity;
        }
        if (type == 'object') {
            return baseMatches(func);
        }
        return thisArg === undefined ? property(func) : baseMatchesProperty(func, thisArg);
    }
    return baseCallback;
});