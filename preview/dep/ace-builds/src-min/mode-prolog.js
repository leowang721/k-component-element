define('ace/mode/prolog_highlight_rules', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text_highlight_rules'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('./text_highlight_rules').TextHighlightRules, s = function () {
            this.$rules = {
                start: [
                    { include: '#comment' },
                    { include: '#basic_fact' },
                    { include: '#rule' },
                    { include: '#directive' },
                    { include: '#fact' }
                ],
                '#atom': [
                    {
                        token: 'constant.other.atom.prolog',
                        regex: '\\b[a-z][a-zA-Z0-9_]*\\b'
                    },
                    {
                        token: 'constant.numeric.prolog',
                        regex: '-?\\d+(?:\\.\\d+)?'
                    },
                    { include: '#string' }
                ],
                '#basic_elem': [
                    { include: '#comment' },
                    { include: '#statement' },
                    { include: '#constants' },
                    { include: '#operators' },
                    { include: '#builtins' },
                    { include: '#list' },
                    { include: '#atom' },
                    { include: '#variable' }
                ],
                '#basic_fact': [{
                        token: [
                            'entity.name.function.fact.basic.prolog',
                            'punctuation.end.fact.basic.prolog'
                        ],
                        regex: '([a-z]\\w*)(\\.)'
                    }],
                '#builtins': [{
                        token: 'support.function.builtin.prolog',
                        regex: '\\b(?:abolish|abort|ancestors|arg|ascii|assert[az]|atom(?:ic)?|body|char|close|conc|concat|consult|define|definition|dynamic|dump|fail|file|free|free_proc|functor|getc|goal|halt|head|head|integer|length|listing|match_args|member|next_clause|nl|nonvar|nth|number|cvars|nvars|offset|op|print?|prompt|putc|quoted|ratom|read|redefine|rename|retract(?:all)?|see|seeing|seen|skip|spy|statistics|system|tab|tell|telling|term|time|told|univ|unlink_clause|unspy_predicate|var|write)\\b'
                    }],
                '#comment': [
                    {
                        token: [
                            'punctuation.definition.comment.prolog',
                            'comment.line.percentage.prolog'
                        ],
                        regex: '(%)(.*$)'
                    },
                    {
                        token: 'punctuation.definition.comment.prolog',
                        regex: '/\\*',
                        push: [
                            {
                                token: 'punctuation.definition.comment.prolog',
                                regex: '\\*/',
                                next: 'pop'
                            },
                            { defaultToken: 'comment.block.prolog' }
                        ]
                    }
                ],
                '#constants': [{
                        token: 'constant.language.prolog',
                        regex: '\\b(?:true|false|yes|no)\\b'
                    }],
                '#directive': [{
                        token: 'keyword.operator.directive.prolog',
                        regex: ':-',
                        push: [
                            {
                                token: 'meta.directive.prolog',
                                regex: '\\.',
                                next: 'pop'
                            },
                            { include: '#comment' },
                            { include: '#statement' },
                            { defaultToken: 'meta.directive.prolog' }
                        ]
                    }],
                '#expr': [
                    { include: '#comments' },
                    {
                        token: 'meta.expression.prolog',
                        regex: '\\(',
                        push: [
                            {
                                token: 'meta.expression.prolog',
                                regex: '\\)',
                                next: 'pop'
                            },
                            { include: '#expr' },
                            { defaultToken: 'meta.expression.prolog' }
                        ]
                    },
                    {
                        token: 'keyword.control.cutoff.prolog',
                        regex: '!'
                    },
                    {
                        token: 'punctuation.control.and.prolog',
                        regex: ','
                    },
                    {
                        token: 'punctuation.control.or.prolog',
                        regex: ';'
                    },
                    { include: '#basic_elem' }
                ],
                '#fact': [{
                        token: [
                            'entity.name.function.fact.prolog',
                            'punctuation.begin.fact.parameters.prolog'
                        ],
                        regex: '([a-z]\\w*)(\\()(?!.*:-)',
                        push: [
                            {
                                token: [
                                    'punctuation.end.fact.parameters.prolog',
                                    'punctuation.end.fact.prolog'
                                ],
                                regex: '(\\))(\\.?)',
                                next: 'pop'
                            },
                            { include: '#parameter' },
                            { defaultToken: 'meta.fact.prolog' }
                        ]
                    }],
                '#list': [{
                        token: 'punctuation.begin.list.prolog',
                        regex: '\\[(?=.*\\])',
                        push: [
                            {
                                token: 'punctuation.end.list.prolog',
                                regex: '\\]',
                                next: 'pop'
                            },
                            { include: '#comment' },
                            {
                                token: 'punctuation.separator.list.prolog',
                                regex: ','
                            },
                            {
                                token: 'punctuation.concat.list.prolog',
                                regex: '\\|',
                                push: [
                                    {
                                        token: 'meta.list.concat.prolog',
                                        regex: '(?=\\s*\\])',
                                        next: 'pop'
                                    },
                                    { include: '#basic_elem' },
                                    { defaultToken: 'meta.list.concat.prolog' }
                                ]
                            },
                            { include: '#basic_elem' },
                            { defaultToken: 'meta.list.prolog' }
                        ]
                    }],
                '#operators': [{
                        token: 'keyword.operator.prolog',
                        regex: '\\\\\\+|\\bnot\\b|\\bis\\b|->|[><]|[><\\\\:=]?=|(?:=\\\\|\\\\=)='
                    }],
                '#parameter': [
                    {
                        token: 'variable.language.anonymous.prolog',
                        regex: '\\b_\\b'
                    },
                    {
                        token: 'variable.parameter.prolog',
                        regex: '\\b[A-Z_]\\w*\\b'
                    },
                    {
                        token: 'punctuation.separator.parameters.prolog',
                        regex: ','
                    },
                    { include: '#basic_elem' },
                    {
                        token: 'text',
                        regex: '[^\\s]'
                    }
                ],
                '#rule': [{
                        token: 'meta.rule.prolog',
                        regex: '(?=[a-z]\\w*.*:-)',
                        push: [
                            {
                                token: 'punctuation.rule.end.prolog',
                                regex: '\\.',
                                next: 'pop'
                            },
                            {
                                token: 'meta.rule.signature.prolog',
                                regex: '(?=[a-z]\\w*.*:-)',
                                push: [
                                    {
                                        token: 'meta.rule.signature.prolog',
                                        regex: '(?=:-)',
                                        next: 'pop'
                                    },
                                    {
                                        token: 'entity.name.function.rule.prolog',
                                        regex: '[a-z]\\w*(?=\\(|\\s*:-)'
                                    },
                                    {
                                        token: 'punctuation.rule.parameters.begin.prolog',
                                        regex: '\\(',
                                        push: [
                                            {
                                                token: 'punctuation.rule.parameters.end.prolog',
                                                regex: '\\)',
                                                next: 'pop'
                                            },
                                            { include: '#parameter' },
                                            { defaultToken: 'meta.rule.parameters.prolog' }
                                        ]
                                    },
                                    { defaultToken: 'meta.rule.signature.prolog' }
                                ]
                            },
                            {
                                token: 'keyword.operator.definition.prolog',
                                regex: ':-',
                                push: [
                                    {
                                        token: 'meta.rule.definition.prolog',
                                        regex: '(?=\\.)',
                                        next: 'pop'
                                    },
                                    { include: '#comment' },
                                    { include: '#expr' },
                                    { defaultToken: 'meta.rule.definition.prolog' }
                                ]
                            },
                            { defaultToken: 'meta.rule.prolog' }
                        ]
                    }],
                '#statement': [{
                        token: 'meta.statement.prolog',
                        regex: '(?=[a-z]\\w*\\()',
                        push: [
                            {
                                token: 'punctuation.end.statement.parameters.prolog',
                                regex: '\\)',
                                next: 'pop'
                            },
                            { include: '#builtins' },
                            { include: '#atom' },
                            {
                                token: 'punctuation.begin.statement.parameters.prolog',
                                regex: '\\(',
                                push: [
                                    {
                                        token: 'meta.statement.parameters.prolog',
                                        regex: '(?=\\))',
                                        next: 'pop'
                                    },
                                    {
                                        token: 'punctuation.separator.statement.prolog',
                                        regex: ','
                                    },
                                    { include: '#basic_elem' },
                                    { defaultToken: 'meta.statement.parameters.prolog' }
                                ]
                            },
                            { defaultToken: 'meta.statement.prolog' }
                        ]
                    }],
                '#string': [{
                        token: 'punctuation.definition.string.begin.prolog',
                        regex: '\'',
                        push: [
                            {
                                token: 'punctuation.definition.string.end.prolog',
                                regex: '\'',
                                next: 'pop'
                            },
                            {
                                token: 'constant.character.escape.prolog',
                                regex: '\\\\.'
                            },
                            {
                                token: 'constant.character.escape.quote.prolog',
                                regex: '\'\''
                            },
                            { defaultToken: 'string.quoted.single.prolog' }
                        ]
                    }],
                '#variable': [
                    {
                        token: 'variable.language.anonymous.prolog',
                        regex: '\\b_\\b'
                    },
                    {
                        token: 'variable.other.prolog',
                        regex: '\\b[A-Z_][a-zA-Z0-9_]*\\b'
                    }
                ]
            }, this.normalizeRules();
        };
    s.metaData = {
        fileTypes: [
            'plg',
            'prolog'
        ],
        foldingStartMarker: '(%\\s*region \\w*)|([a-z]\\w*.*:- ?)',
        foldingStopMarker: '(%\\s*end(\\s*region)?)|(?=\\.)',
        keyEquivalent: '^~P',
        name: 'Prolog',
        scopeName: 'source.prolog'
    }, r.inherits(s, i), t.PrologHighlightRules = s;
}), define('ace/mode/folding/cstyle', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/range',
    'ace/mode/folding/fold_mode'
], function (e, t, n) {
    'use strict';
    var r = e('../../lib/oop'), i = e('../../range').Range, s = e('./fold_mode').FoldMode, o = t.FoldMode = function (e) {
            e && (this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, '|' + e.start)), this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, '|' + e.end)));
        };
    r.inherits(o, s), function () {
        this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/, this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/, this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/, this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/, this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/, this._getFoldWidgetBase = this.getFoldWidget, this.getFoldWidget = function (e, t, n) {
            var r = e.getLine(n);
            if (this.singleLineBlockCommentRe.test(r) && !this.startRegionRe.test(r) && !this.tripleStarBlockCommentRe.test(r))
                return '';
            var i = this._getFoldWidgetBase(e, t, n);
            return !i && this.startRegionRe.test(r) ? 'start' : i;
        }, this.getFoldWidgetRange = function (e, t, n, r) {
            var i = e.getLine(n);
            if (this.startRegionRe.test(i))
                return this.getCommentRegionBlock(e, i, n);
            var s = i.match(this.foldingStartMarker);
            if (s) {
                var o = s.index;
                if (s[1])
                    return this.openingBracketBlock(e, s[1], n, o);
                var u = e.getCommentFoldRange(n, o + s[0].length, 1);
                return u && !u.isMultiLine() && (r ? u = this.getSectionRange(e, n) : t != 'all' && (u = null)), u;
            }
            if (t === 'markbegin')
                return;
            var s = i.match(this.foldingStopMarker);
            if (s) {
                var o = s.index + s[0].length;
                return s[1] ? this.closingBracketBlock(e, s[1], n, o) : e.getCommentFoldRange(n, o, -1);
            }
        }, this.getSectionRange = function (e, t) {
            var n = e.getLine(t), r = n.search(/\S/), s = t, o = n.length;
            t += 1;
            var u = t, a = e.getLength();
            while (++t < a) {
                n = e.getLine(t);
                var f = n.search(/\S/);
                if (f === -1)
                    continue;
                if (r > f)
                    break;
                var l = this.getFoldWidgetRange(e, 'all', t);
                if (l) {
                    if (l.start.row <= s)
                        break;
                    if (l.isMultiLine())
                        t = l.end.row;
                    else if (r == f)
                        break;
                }
                u = t;
            }
            return new i(s, o, u, e.getLine(u).length);
        }, this.getCommentRegionBlock = function (e, t, n) {
            var r = t.search(/\s*$/), s = e.getLength(), o = n, u = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/, a = 1;
            while (++n < s) {
                t = e.getLine(n);
                var f = u.exec(t);
                if (!f)
                    continue;
                f[1] ? a-- : a++;
                if (!a)
                    break;
            }
            var l = n;
            if (l > o)
                return new i(o, r, l, t.length);
        };
    }.call(o.prototype);
}), define('ace/mode/prolog', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text',
    'ace/mode/prolog_highlight_rules',
    'ace/mode/folding/cstyle'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('./text').Mode, s = e('./prolog_highlight_rules').PrologHighlightRules, o = e('./folding/cstyle').FoldMode, u = function () {
            this.HighlightRules = s, this.foldingRules = new o();
        };
    r.inherits(u, i), function () {
        this.lineCommentStart = '%', this.blockComment = {
            start: '/*',
            end: '*/'
        }, this.$id = 'ace/mode/prolog';
    }.call(u.prototype), t.Mode = u;
});