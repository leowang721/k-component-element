define('lodash/date/now', ['../lang/isNative'], function (isNative) {
    var nativeNow = isNative(nativeNow = Date.now) && nativeNow;
    var now = nativeNow || function () {
            return new Date().getTime();
        };
    return now;
});