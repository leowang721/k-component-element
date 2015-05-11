define('lodash/internal/compareAscending', ['./baseCompareAscending'], function (baseCompareAscending) {
    function compareAscending(object, other) {
        return baseCompareAscending(object.criteria, other.criteria) || object.index - other.index;
    }
    return compareAscending;
});