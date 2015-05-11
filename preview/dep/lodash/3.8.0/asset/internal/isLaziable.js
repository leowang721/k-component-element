define('lodash/internal/isLaziable', [
    './LazyWrapper',
    './getFuncName',
    '../chain/lodash'
], function (LazyWrapper, getFuncName, lodash) {
    function isLaziable(func) {
        var funcName = getFuncName(func);
        return !!funcName && func === lodash[funcName] && funcName in LazyWrapper.prototype;
    }
    return isLaziable;
});