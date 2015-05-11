define('lodash/internal/unescapeHtmlChar', [], function () {
    var htmlUnescapes = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': '\'',
            '&#96;': '`'
        };
    function unescapeHtmlChar(chr) {
        return htmlUnescapes[chr];
    }
    return unescapeHtmlChar;
});