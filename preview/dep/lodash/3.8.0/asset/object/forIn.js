define('lodash/object/forIn', [
    '../internal/baseFor',
    '../internal/createForIn'
], function (baseFor, createForIn) {
    var forIn = createForIn(baseFor);
    return forIn;
});