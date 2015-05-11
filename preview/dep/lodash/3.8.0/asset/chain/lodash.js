define('lodash/chain/lodash', [
    '../internal/LazyWrapper',
    '../internal/LodashWrapper',
    '../internal/baseLodash',
    '../lang/isArray',
    '../internal/isObjectLike',
    '../internal/wrapperClone'
], function (LazyWrapper, LodashWrapper, baseLodash, isArray, isObjectLike, wrapperClone) {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function lodash(value) {
        if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
            if (value instanceof LodashWrapper) {
                return value;
            }
            if (hasOwnProperty.call(value, '__chain__') && hasOwnProperty.call(value, '__wrapped__')) {
                return wrapperClone(value);
            }
        }
        return new LodashWrapper(value);
    }
    lodash.prototype = baseLodash.prototype;
    return lodash;
});