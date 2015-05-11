define('lodash/internal/baseSetData', [
    '../utility/identity',
    './metaMap'
], function (identity, metaMap) {
    var baseSetData = !metaMap ? identity : function (func, data) {
            metaMap.set(func, data);
            return func;
        };
    return baseSetData;
});