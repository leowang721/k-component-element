define('lodash/internal/trimmedRightIndex', ['./isSpace'], function (isSpace) {
    function trimmedRightIndex(string) {
        var index = string.length;
        while (index-- && isSpace(string.charCodeAt(index))) {
        }
        return index;
    }
    return trimmedRightIndex;
});