define('lodash/lang/clone', [
    '../internal/baseClone',
    '../internal/bindCallback',
    '../internal/isIterateeCall'
], function (baseClone, bindCallback, isIterateeCall) {
    function clone(value, isDeep, customizer, thisArg) {
        if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
            isDeep = false;
        } else if (typeof isDeep == 'function') {
            thisArg = customizer;
            customizer = isDeep;
            isDeep = false;
        }
        customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
        return baseClone(value, isDeep, customizer);
    }
    return clone;
});