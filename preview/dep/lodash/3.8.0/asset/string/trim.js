define('lodash/string/trim', [
    '../internal/baseToString',
    '../internal/charsLeftIndex',
    '../internal/charsRightIndex',
    '../internal/isIterateeCall',
    '../internal/trimmedLeftIndex',
    '../internal/trimmedRightIndex'
], function (baseToString, charsLeftIndex, charsRightIndex, isIterateeCall, trimmedLeftIndex, trimmedRightIndex) {
    function trim(string, chars, guard) {
        var value = string;
        string = baseToString(string);
        if (!string) {
            return string;
        }
        if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
            return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
        }
        chars = chars + '';
        return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
    }
    return trim;
});