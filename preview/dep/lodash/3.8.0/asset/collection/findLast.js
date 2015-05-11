define('lodash/collection/findLast', [
    '../internal/baseEachRight',
    '../internal/createFind'
], function (baseEachRight, createFind) {
    var findLast = createFind(baseEachRight, true);
    return findLast;
});