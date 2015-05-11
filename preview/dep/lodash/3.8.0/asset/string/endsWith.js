define('lodash/string/endsWith', ['../internal/baseToString'], function (baseToString) {
    var undefined;
    var nativeMin = Math.min;
    function endsWith(string, target, position) {
        string = baseToString(string);
        target = target + '';
        var length = string.length;
        position = position === undefined ? length : nativeMin(position < 0 ? 0 : +position || 0, length);
        position -= target.length;
        return position >= 0 && string.indexOf(target, position) == position;
    }
    return endsWith;
});