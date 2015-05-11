define('lodash/internal/toPath', [
    './baseToString',
    '../lang/isArray'
], function (baseToString, isArray) {
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
    var reEscapeChar = /\\(\\)?/g;
    function toPath(value) {
        if (isArray(value)) {
            return value;
        }
        var result = [];
        baseToString(value).replace(rePropName, function (match, number, quote, string) {
            result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
        });
        return result;
    }
    return toPath;
});