define('lodash/internal/isStrictComparable', ['../lang/isObject'], function (isObject) {
    function isStrictComparable(value) {
        return value === value && !isObject(value);
    }
    return isStrictComparable;
});