define('lodash/collection/find', [
    '../internal/baseEach',
    '../internal/createFind'
], function (baseEach, createFind) {
    var find = createFind(baseEach);
    return find;
});