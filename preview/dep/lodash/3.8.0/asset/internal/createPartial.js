define('lodash/internal/createPartial', [
    './createWrapper',
    './replaceHolders',
    '../function/restParam'
], function (createWrapper, replaceHolders, restParam) {
    function createPartial(flag) {
        var partialFunc = restParam(function (func, partials) {
                var holders = replaceHolders(partials, partialFunc.placeholder);
                return createWrapper(func, flag, null, partials, holders);
            });
        return partialFunc;
    }
    return createPartial;
});