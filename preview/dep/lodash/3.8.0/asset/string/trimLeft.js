define('lodash/string/trimLeft', [
    '../internal/baseToString',
    '../internal/charsLeftIndex',
    '../internal/isIterateeCall',
    '../internal/trimmedLeftIndex'
], function (baseToString, charsLeftIndex, isIterateeCall, trimmedLeftIndex) {
    function trimLeft(string, chars, guard) {
        var value = string;
        string = baseToString(string);
        if (!string) {
            return string;
        }
        if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
            return string.slice(trimmedLeftIndex(string));
        }
        return string.slice(charsLeftIndex(string, chars + ''));
    }
    return trimLeft;
});