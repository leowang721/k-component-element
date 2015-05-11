define('lodash/internal/getData', [
    './metaMap',
    '../utility/noop'
], function (metaMap, noop) {
    var getData = !metaMap ? noop : function (func) {
            return metaMap.get(func);
        };
    return getData;
});