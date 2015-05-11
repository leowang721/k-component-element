define('lodash/lang/isFinite', [
    './isNative',
    '../internal/root'
], function (isNative, root) {
    var nativeIsFinite = root.isFinite, nativeNumIsFinite = isNative(nativeNumIsFinite = Number.isFinite) && nativeNumIsFinite;
    var isFinite = nativeNumIsFinite || function (value) {
            return typeof value == 'number' && nativeIsFinite(value);
        };
    return isFinite;
});