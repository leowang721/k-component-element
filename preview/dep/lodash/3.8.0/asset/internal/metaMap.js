define('lodash/internal/metaMap', [
    '../lang/isNative',
    './root'
], function (isNative, root) {
    var WeakMap = isNative(WeakMap = root.WeakMap) && WeakMap;
    var metaMap = WeakMap && new WeakMap();
    return metaMap;
});