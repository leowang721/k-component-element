define('lodash/utility/matches', [
    '../internal/baseClone',
    '../internal/baseMatches'
], function (baseClone, baseMatches) {
    function matches(source) {
        return baseMatches(baseClone(source, true));
    }
    return matches;
});