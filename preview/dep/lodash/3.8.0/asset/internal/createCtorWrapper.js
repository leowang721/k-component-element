define('lodash/internal/createCtorWrapper', [
    './baseCreate',
    '../lang/isObject'
], function (baseCreate, isObject) {
    function createCtorWrapper(Ctor) {
        return function () {
            var thisBinding = baseCreate(Ctor.prototype), result = Ctor.apply(thisBinding, arguments);
            return isObject(result) ? result : thisBinding;
        };
    }
    return createCtorWrapper;
});