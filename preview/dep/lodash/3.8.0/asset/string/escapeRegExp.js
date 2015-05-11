define('lodash/string/escapeRegExp', ['../internal/baseToString'], function (baseToString) {
    var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g, reHasRegExpChars = RegExp(reRegExpChars.source);
    function escapeRegExp(string) {
        string = baseToString(string);
        return string && reHasRegExpChars.test(string) ? string.replace(reRegExpChars, '\\$&') : string;
    }
    return escapeRegExp;
});