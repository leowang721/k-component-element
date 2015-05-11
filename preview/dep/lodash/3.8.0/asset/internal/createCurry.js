define('lodash/internal/createCurry', [
    './createWrapper',
    './isIterateeCall'
], function (createWrapper, isIterateeCall) {
    function createCurry(flag) {
        function curryFunc(func, arity, guard) {
            if (guard && isIterateeCall(func, arity, guard)) {
                arity = null;
            }
            var result = createWrapper(func, flag, null, null, null, null, null, arity);
            result.placeholder = curryFunc.placeholder;
            return result;
        }
        return curryFunc;
    }
    return createCurry;
});