define('lodash/internal/baseCompareAscending', [], function () {
    var undefined;
    function baseCompareAscending(value, other) {
        if (value !== other) {
            var valIsReflexive = value === value, othIsReflexive = other === other;
            if (value > other || !valIsReflexive || value === undefined && othIsReflexive) {
                return 1;
            }
            if (value < other || !othIsReflexive || other === undefined && valIsReflexive) {
                return -1;
            }
        }
        return 0;
    }
    return baseCompareAscending;
});