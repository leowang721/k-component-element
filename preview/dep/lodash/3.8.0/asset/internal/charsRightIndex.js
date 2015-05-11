define('lodash/internal/charsRightIndex', [], function () {
    function charsRightIndex(string, chars) {
        var index = string.length;
        while (index-- && chars.indexOf(string.charAt(index)) > -1) {
        }
        return index;
    }
    return charsRightIndex;
});