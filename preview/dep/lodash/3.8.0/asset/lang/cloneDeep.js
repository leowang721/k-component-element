define('lodash/lang/cloneDeep', [
    '../internal/baseClone',
    '../internal/bindCallback'
], function (baseClone, bindCallback) {
    function cloneDeep(value, customizer, thisArg) {
        customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
        return baseClone(value, true, customizer);
    }
    return cloneDeep;
});