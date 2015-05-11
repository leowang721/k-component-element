define('lodash/utility/matchesProperty', [
    '../internal/baseClone',
    '../internal/baseMatchesProperty'
], function (baseClone, baseMatchesProperty) {
    function matchesProperty(path, value) {
        return baseMatchesProperty(path, baseClone(value, true));
    }
    return matchesProperty;
});