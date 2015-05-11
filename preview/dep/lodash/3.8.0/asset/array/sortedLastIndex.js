define('lodash/array/sortedLastIndex', ['../internal/createSortedIndex'], function (createSortedIndex) {
    var sortedLastIndex = createSortedIndex(true);
    return sortedLastIndex;
});