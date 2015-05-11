define('lodash/lang/isEqual', [
    '../internal/baseIsEqual',
    '../internal/bindCallback',
    '../internal/isStrictComparable'
], function (baseIsEqual, bindCallback, isStrictComparable) {
    var undefined;
    function isEqual(value, other, customizer, thisArg) {
        customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
        if (!customizer && isStrictComparable(value) && isStrictComparable(other)) {
            return value === other;
        }
        var result = customizer ? customizer(value, other) : undefined;
        return result === undefined ? baseIsEqual(value, other, customizer) : !!result;
    }
    return isEqual;
});