define('lodash/string/pad', [
    '../internal/baseToString',
    '../internal/createPadding',
    '../internal/root'
], function (baseToString, createPadding, root) {
    var ceil = Math.ceil, floor = Math.floor;
    var nativeIsFinite = root.isFinite;
    function pad(string, length, chars) {
        string = baseToString(string);
        length = +length;
        var strLength = string.length;
        if (strLength >= length || !nativeIsFinite(length)) {
            return string;
        }
        var mid = (length - strLength) / 2, leftLength = floor(mid), rightLength = ceil(mid);
        chars = createPadding('', rightLength, chars);
        return chars.slice(0, leftLength) + string + chars;
    }
    return pad;
});