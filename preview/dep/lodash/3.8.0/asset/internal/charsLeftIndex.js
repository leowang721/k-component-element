define('lodash/internal/charsLeftIndex', [], function () {
    function charsLeftIndex(string, chars) {
        var index = -1, length = string.length;
        while (++index < length && chars.indexOf(string.charAt(index)) > -1) {
        }
        return index;
    }
    return charsLeftIndex;
});