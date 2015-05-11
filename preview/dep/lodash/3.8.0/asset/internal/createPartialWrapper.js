define('lodash/internal/createPartialWrapper', [
    './createCtorWrapper',
    './root'
], function (createCtorWrapper, root) {
    var BIND_FLAG = 1;
    function createPartialWrapper(func, bitmask, thisArg, partials) {
        var isBind = bitmask & BIND_FLAG, Ctor = createCtorWrapper(func);
        function wrapper() {
            var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(argsLength + leftLength);
            while (++leftIndex < leftLength) {
                args[leftIndex] = partials[leftIndex];
            }
            while (argsLength--) {
                args[leftIndex++] = arguments[++argsIndex];
            }
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return fn.apply(isBind ? thisArg : this, args);
        }
        return wrapper;
    }
    return createPartialWrapper;
});