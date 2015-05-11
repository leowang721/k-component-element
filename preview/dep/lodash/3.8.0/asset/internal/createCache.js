define('lodash/internal/createCache', [
    './SetCache',
    '../utility/constant',
    '../lang/isNative',
    './root'
], function (SetCache, constant, isNative, root) {
    var Set = isNative(Set = root.Set) && Set;
    var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;
    var createCache = !(nativeCreate && Set) ? constant(null) : function (values) {
            return new SetCache(values);
        };
    return createCache;
});