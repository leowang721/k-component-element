define('ace/mode/doc_comment_highlight_rules', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text_highlight_rules',
    '../lib/oop',
    './text_highlight_rules'
], function (require, exports, module) {
    'use strict';
    var oop = require('../lib/oop');
    var TextHighlightRules = require('./text_highlight_rules').TextHighlightRules;
    var DocCommentHighlightRules = function () {
        this.$rules = {
            'start': [
                {
                    token: 'comment.doc.tag',
                    regex: '@[\\w\\d_]+'
                },
                DocCommentHighlightRules.getTagRule(),
                {
                    defaultToken: 'comment.doc',
                    caseInsensitive: true
                }
            ]
        };
    };
    oop.inherits(DocCommentHighlightRules, TextHighlightRules);
    DocCommentHighlightRules.getTagRule = function (start) {
        return {
            token: 'comment.doc.tag.storage.type',
            regex: '\\b(?:TODO|FIXME|XXX|HACK)\\b'
        };
    };
    DocCommentHighlightRules.getStartRule = function (start) {
        return {
            token: 'comment.doc',
            regex: '\\/\\*(?=\\*)',
            next: start
        };
    };
    DocCommentHighlightRules.getEndRule = function (start) {
        return {
            token: 'comment.doc',
            regex: '\\*\\/',
            next: start
        };
    };
    exports.DocCommentHighlightRules = DocCommentHighlightRules;
});
define('ace/mode/lean_highlight_rules', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/doc_comment_highlight_rules',
    'ace/mode/text_highlight_rules',
    '../lib/oop',
    './doc_comment_highlight_rules',
    './text_highlight_rules'
], function (require, exports, module) {
    'use strict';
    var oop = require('../lib/oop');
    var DocCommentHighlightRules = require('./doc_comment_highlight_rules').DocCommentHighlightRules;
    var TextHighlightRules = require('./text_highlight_rules').TextHighlightRules;
    var leanHighlightRules = function () {
        var keywordControls = [
                'add_rewrite',
                'alias',
                'as',
                'assume',
                'attribute',
                'begin',
                'by',
                'calc',
                'calc_refl',
                'calc_subst',
                'calc_trans',
                'check',
                'classes',
                'coercions',
                'conjecture',
                'constants',
                'context',
                'corollary',
                'else',
                'end',
                'environment',
                'eval',
                'example',
                'exists',
                'exit',
                'export',
                'exposing',
                'extends',
                'fields',
                'find_decl',
                'forall',
                'from',
                'fun',
                'have',
                'help',
                'hiding',
                'if',
                'import',
                'in',
                'infix',
                'infixl',
                'infixr',
                'instances',
                'let',
                'local',
                'match',
                'namespace',
                'notation',
                'obtain',
                'obtains',
                'omit',
                'opaque',
                'open',
                'options',
                'parameter',
                'parameters',
                'postfix',
                'precedence',
                'prefix',
                'premise',
                'premises',
                'print',
                'private',
                'proof',
                'protected',
                'qed',
                'raw',
                'renaming',
                'section',
                'set_option',
                'show',
                'tactic_hint',
                'take',
                'then',
                'universe',
                'universes',
                'using',
                'variable',
                'variables',
                'with'
            ].join('|');
        var nameProviders = [
                'inductive',
                'structure',
                'record',
                'theorem',
                'axiom',
                'axioms',
                'lemma',
                'hypothesis',
                'definition',
                'constant'
            ].join('|');
        var storageType = [
                'Prop',
                'Type',
                'Type\'',
                'Type\u208A',
                'Type\u2081',
                'Type\u2082',
                'Type\u2083'
            ].join('|');
        var storageModifiers = '\\[(' + [
                'abbreviations',
                'all-transparent',
                'begin-end-hints',
                'class',
                'classes',
                'coercion',
                'coercions',
                'declarations',
                'decls',
                'instance',
                'irreducible',
                'multiple-instances',
                'notation',
                'notations',
                'parsing-only',
                'persistent',
                'reduce-hints',
                'reducible',
                'tactic-hints',
                'visible',
                'wf',
                'whnf'
            ].join('|') + ')\\]';
        var keywordOperators = [].join('|');
        var keywordMapper = this.$keywords = this.createKeywordMapper({
                'keyword.control': keywordControls,
                'storage.type': storageType,
                'keyword.operator': keywordOperators,
                'variable.language': 'sorry'
            }, 'identifier');
        var identifierRe = '[A-Za-z_\u03B1-\u03BA\u03BC-\u03FB\u1F00-\u1FFE\u2100-\u214F][A-Za-z0-9_\'\u03B1-\u03BA\u03BC-\u03FB\u1F00-\u1FFE\u2070-\u2079\u207F-\u2089\u2090-\u209C\u2100-\u214F]*';
        var operatorRe = new RegExp([
                '#',
                '@',
                '->',
                '\u223C',
                '\u2194',
                '/',
                '==',
                '=',
                ':=',
                '<->',
                '/\\',
                '\\/',
                '\u2227',
                '\u2228',
                '\u2260',
                '<',
                '>',
                '\u2264',
                '\u2265',
                '\xAC',
                '<=',
                '>=',
                '\u207B\xB9',
                '\u2B1D',
                '\u25B8',
                '\\+',
                '\\*',
                '-',
                '/',
                '\u03BB',
                '\u2192',
                '\u2203',
                '\u2200',
                ':='
            ].join('|'));
        this.$rules = {
            'start': [
                {
                    token: 'comment',
                    regex: '--.*$'
                },
                DocCommentHighlightRules.getStartRule('doc-start'),
                {
                    token: 'comment',
                    regex: '\\/-',
                    next: 'comment'
                },
                {
                    stateName: 'qqstring',
                    token: 'string.start',
                    regex: '"',
                    next: [
                        {
                            token: 'string.end',
                            regex: '"',
                            next: 'start'
                        },
                        {
                            token: 'constant.language.escape',
                            regex: /\\[n"\\]/
                        },
                        { defaultToken: 'string' }
                    ]
                },
                {
                    token: 'keyword.control',
                    regex: nameProviders,
                    next: [{
                            token: 'variable.language',
                            regex: identifierRe,
                            next: 'start'
                        }]
                },
                {
                    token: 'constant.numeric',
                    regex: '0[xX][0-9a-fA-F]+(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b'
                },
                {
                    token: 'constant.numeric',
                    regex: '[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b'
                },
                {
                    token: 'storage.modifier',
                    regex: storageModifiers
                },
                {
                    token: keywordMapper,
                    regex: identifierRe
                },
                {
                    token: 'operator',
                    regex: operatorRe
                },
                {
                    token: 'punctuation.operator',
                    regex: '\\?|\\:|\\,|\\;|\\.'
                },
                {
                    token: 'paren.lparen',
                    regex: '[[({]'
                },
                {
                    token: 'paren.rparen',
                    regex: '[\\])}]'
                },
                {
                    token: 'text',
                    regex: '\\s+'
                }
            ],
            'comment': [
                {
                    token: 'comment',
                    regex: '-/',
                    next: 'start'
                },
                { defaultToken: 'comment' }
            ]
        };
        this.embedRules(DocCommentHighlightRules, 'doc-', [DocCommentHighlightRules.getEndRule('start')]);
        this.normalizeRules();
    };
    oop.inherits(leanHighlightRules, TextHighlightRules);
    exports.leanHighlightRules = leanHighlightRules;
});
define('ace/mode/matching_brace_outdent', [
    'require',
    'exports',
    'module',
    'ace/range',
    '../range'
], function (require, exports, module) {
    'use strict';
    var Range = require('../range').Range;
    var MatchingBraceOutdent = function () {
    };
    (function () {
        this.checkOutdent = function (line, input) {
            if (!/^\s+$/.test(line))
                return false;
            return /^\s*\}/.test(input);
        };
        this.autoOutdent = function (doc, row) {
            var line = doc.getLine(row);
            var match = line.match(/^(\s*\})/);
            if (!match)
                return 0;
            var column = match[1].length;
            var openBracePos = doc.findMatchingBracket({
                    row: row,
                    column: column
                });
            if (!openBracePos || openBracePos.row == row)
                return 0;
            var indent = this.$getIndent(doc.getLine(openBracePos.row));
            doc.replace(new Range(row, 0, row, column - 1), indent);
        };
        this.$getIndent = function (line) {
            return line.match(/^\s*/)[0];
        };
    }.call(MatchingBraceOutdent.prototype));
    exports.MatchingBraceOutdent = MatchingBraceOutdent;
});
define('ace/mode/lean', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text',
    'ace/mode/lean_highlight_rules',
    'ace/mode/matching_brace_outdent',
    'ace/range',
    '../lib/oop',
    './text',
    './lean_highlight_rules',
    './matching_brace_outdent',
    '../range'
], function (require, exports, module) {
    'use strict';
    var oop = require('../lib/oop');
    var TextMode = require('./text').Mode;
    var leanHighlightRules = require('./lean_highlight_rules').leanHighlightRules;
    var MatchingBraceOutdent = require('./matching_brace_outdent').MatchingBraceOutdent;
    var Range = require('../range').Range;
    var Mode = function () {
        this.HighlightRules = leanHighlightRules;
        this.$outdent = new MatchingBraceOutdent();
    };
    oop.inherits(Mode, TextMode);
    (function () {
        this.lineCommentStart = '--';
        this.blockComment = {
            start: '/-',
            end: '-/'
        };
        this.getNextLineIndent = function (state, line, tab) {
            var indent = this.$getIndent(line);
            var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
            var tokens = tokenizedLine.tokens;
            var endState = tokenizedLine.state;
            if (tokens.length && tokens[tokens.length - 1].type == 'comment') {
                return indent;
            }
            if (state == 'start') {
                var match = line.match(/^.*[\{\(\[]\s*$/);
                if (match) {
                    indent += tab;
                }
            } else if (state == 'doc-start') {
                if (endState == 'start') {
                    return '';
                }
                var match = line.match(/^\s*(\/?)\*/);
                if (match) {
                    if (match[1]) {
                        indent += ' ';
                    }
                    indent += '- ';
                }
            }
            return indent;
        };
        this.checkOutdent = function (state, line, input) {
            return this.$outdent.checkOutdent(line, input);
        };
        this.autoOutdent = function (state, doc, row) {
            this.$outdent.autoOutdent(doc, row);
        };
        this.$id = 'ace/mode/lean';
    }.call(Mode.prototype));
    exports.Mode = Mode;
});