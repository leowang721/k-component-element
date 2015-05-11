define('lodash/collection/forEach', [
    '../internal/arrayEach',
    '../internal/baseEach',
    '../internal/createForEach'
], function (arrayEach, baseEach, createForEach) {
    var forEach = createForEach(arrayEach, baseEach);
    return forEach;
});