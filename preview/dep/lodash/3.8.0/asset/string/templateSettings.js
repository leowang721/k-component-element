define('lodash/string/templateSettings', [
    './escape',
    '../internal/reEscape',
    '../internal/reEvaluate',
    '../internal/reInterpolate'
], function (escape, reEscape, reEvaluate, reInterpolate) {
    var templateSettings = {
            'escape': reEscape,
            'evaluate': reEvaluate,
            'interpolate': reInterpolate,
            'variable': '',
            'imports': { '_': { 'escape': escape } }
        };
    return templateSettings;
});