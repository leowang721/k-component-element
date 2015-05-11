define('lodash/internal/createPadding', [
    '../string/repeat',
    './root'
], function (repeat, root) {
    var ceil = Math.ceil;
    var nativeIsFinite = root.isFinite;
    function createPadding(string, length, chars) {
        var strLength = string.length;
        length = +length;
        if (strLength >= length || !nativeIsFinite(length)) {
            return '';
        }
        var padLength = length - strLength;
        chars = chars == null ? ' ' : chars + '';
        return repeat(chars, ceil(padLength / chars.length)).slice(0, padLength);
    }
    return createPadding;
});