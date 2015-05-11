define('lodash/internal/SetCache', [
    './cachePush',
    '../lang/isNative',
    './root'
], function (cachePush, isNative, root) {
    var Set = isNative(Set = root.Set) && Set;
    var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;
    function SetCache(values) {
        var length = values ? values.length : 0;
        this.data = {
            'hash': nativeCreate(null),
            'set': new Set()
        };
        while (length--) {
            this.push(values[length]);
        }
    }
    SetCache.prototype.push = cachePush;
    return SetCache;
});