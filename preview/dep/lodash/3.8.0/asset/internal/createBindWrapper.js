define('lodash/internal/createBindWrapper', [
    './createCtorWrapper',
    './root'
], function (createCtorWrapper, root) {
    function createBindWrapper(func, thisArg) {
        var Ctor = createCtorWrapper(func);
        function wrapper() {
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return fn.apply(thisArg, arguments);
        }
        return wrapper;
    }
    return createBindWrapper;
});