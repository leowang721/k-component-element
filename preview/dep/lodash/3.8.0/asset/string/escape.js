define('lodash/string/escape', [
    '../internal/baseToString',
    '../internal/escapeHtmlChar'
], function (baseToString, escapeHtmlChar) {
    var reUnescapedHtml = /[&<>"'`]/g, reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
    function escape(string) {
        string = baseToString(string);
        return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
    }
    return escape;
});