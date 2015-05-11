define('lodash/internal/trimmedLeftIndex', ['./isSpace'], function (isSpace) {
    function trimmedLeftIndex(string) {
        var index = -1, length = string.length;
        while (++index < length && isSpace(string.charCodeAt(index))) {
        }
        return index;
    }
    return trimmedLeftIndex;
});