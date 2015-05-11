define('lodash/string/trimRight', [
    '../internal/baseToString',
    '../internal/charsRightIndex',
    '../internal/isIterateeCall',
    '../internal/trimmedRightIndex'
], function (baseToString, charsRightIndex, isIterateeCall, trimmedRightIndex) {
    function trimRight(string, chars, guard) {
        var value = string;
        string = baseToString(string);
        if (!string) {
            return string;
        }
        if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
            return string.slice(0, trimmedRightIndex(string) + 1);
        }
        return string.slice(0, charsRightIndex(string, chars + '') + 1);
    }
    return trimRight;
});