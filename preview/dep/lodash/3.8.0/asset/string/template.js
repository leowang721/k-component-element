define('lodash/string/template', [
    '../internal/assignOwnDefaults',
    '../internal/assignWith',
    '../utility/attempt',
    '../internal/baseAssign',
    '../internal/baseToString',
    '../internal/baseValues',
    '../internal/escapeStringChar',
    '../lang/isError',
    '../internal/isIterateeCall',
    '../object/keys',
    '../internal/reInterpolate',
    './templateSettings'
], function (assignOwnDefaults, assignWith, attempt, baseAssign, baseToString, baseValues, escapeStringChar, isError, isIterateeCall, keys, reInterpolate, templateSettings) {
    var undefined;
    var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
    var reNoMatch = /($^)/;
    var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
    function template(string, options, otherOptions) {
        var settings = templateSettings.imports._.templateSettings || templateSettings;
        if (otherOptions && isIterateeCall(string, options, otherOptions)) {
            options = otherOptions = null;
        }
        string = baseToString(string);
        options = assignWith(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);
        var imports = assignWith(baseAssign({}, options.imports), settings.imports, assignOwnDefaults), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
        var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = '__p += \'';
        var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
        var sourceURL = 'sourceURL' in options ? '//# sourceURL=' + options.sourceURL + '\n' : '';
        string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
            interpolateValue || (interpolateValue = esTemplateValue);
            source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
            if (escapeValue) {
                isEscaping = true;
                source += '\' +\n__e(' + escapeValue + ') +\n\'';
            }
            if (evaluateValue) {
                isEvaluating = true;
                source += '\';\n' + evaluateValue + ';\n__p += \'';
            }
            if (interpolateValue) {
                source += '\' +\n((__t = (' + interpolateValue + ')) == null ? \'\' : __t) +\n\'';
            }
            index = offset + match.length;
            return match;
        });
        source += '\';\n';
        var variable = options.variable;
        if (!variable) {
            source = 'with (obj) {\n' + source + '\n}\n';
        }
        source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');
        source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '' : 'obj || (obj = {});\n') + 'var __t, __p = \'\'' + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + 'function print() { __p += __j.call(arguments, \'\') }\n' : ';\n') + source + 'return __p\n}';
        var result = attempt(function () {
                return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
            });
        result.source = source;
        if (isError(result)) {
            throw result;
        }
        return result;
    }
    return template;
});