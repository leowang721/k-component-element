define('lodash/internal/escapeHtmlChar', [], function () {
    var htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '`': '&#96;'
        };
    function escapeHtmlChar(chr) {
        return htmlEscapes[chr];
    }
    return escapeHtmlChar;
});