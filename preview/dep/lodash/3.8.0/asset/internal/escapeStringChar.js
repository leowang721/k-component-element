define('lodash/internal/escapeStringChar', [], function () {
    var stringEscapes = {
            '\\': '\\',
            '\'': '\'',
            '\n': 'n',
            '\r': 'r',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        };
    function escapeStringChar(chr) {
        return '\\' + stringEscapes[chr];
    }
    return escapeStringChar;
});