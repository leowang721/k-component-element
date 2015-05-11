define('lodash/function/bind', [
    '../internal/createWrapper',
    '../internal/replaceHolders',
    './restParam'
], function (createWrapper, replaceHolders, restParam) {
    var BIND_FLAG = 1, PARTIAL_FLAG = 32;
    var bind = restParam(function (func, thisArg, partials) {
            var bitmask = BIND_FLAG;
            if (partials.length) {
                var holders = replaceHolders(partials, bind.placeholder);
                bitmask |= PARTIAL_FLAG;
            }
            return createWrapper(func, bitmask, thisArg, partials, holders);
        });
    bind.placeholder = {};
    return bind;
});