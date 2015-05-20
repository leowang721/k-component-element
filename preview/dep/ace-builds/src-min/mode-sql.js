/*! @2015 Leo Wang. All Rights Reserved */
define('ace/mode/sql_highlight_rules', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text_highlight_rules'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('./text_highlight_rules').TextHighlightRules, s = function () {
            var e = 'select|insert|update|delete|from|where|and|or|group|by|order|limit|offset|having|as|case|when|else|end|type|left|right|join|on|outer|desc|asc|union|create|table|primary|key|if|foreign|not|references|default|null|inner|cross|natural|database|drop|grant', t = 'true|false', n = 'count|min|max|avg|sum|rank|now|coalesce', r = 'int|numeric|decimal|date|varchar|char|bigint|float|double|bit|binary|text|set|timestamp|money|real|number|integer', i = this.createKeywordMapper({
                    'support.function': n,
                    keyword: e,
                    'constant.language': t,
                    'storage.type': r
                }, 'identifier', !0);
            this.$rules = {
                start: [
                    {
                        token: 'comment',
                        regex: '--.*$'
                    },
                    {
                        token: 'comment',
                        start: '/\\*',
                        end: '\\*/'
                    },
                    {
                        token: 'string',
                        regex: '".*?"'
                    },
                    {
                        token: 'string',
                        regex: '\'.*?\''
                    },
                    {
                        token: 'constant.numeric',
                        regex: '[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b'
                    },
                    {
                        token: i,
                        regex: '[a-zA-Z_$][a-zA-Z0-9_$]*\\b'
                    },
                    {
                        token: 'keyword.operator',
                        regex: '\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|='
                    },
                    {
                        token: 'paren.lparen',
                        regex: '[\\(]'
                    },
                    {
                        token: 'paren.rparen',
                        regex: '[\\)]'
                    },
                    {
                        token: 'text',
                        regex: '\\s+'
                    }
                ]
            }, this.normalizeRules();
        };
    r.inherits(s, i), t.SqlHighlightRules = s;
}), define('ace/mode/sql', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text',
    'ace/mode/sql_highlight_rules',
    'ace/range'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('./text').Mode, s = e('./sql_highlight_rules').SqlHighlightRules, o = e('../range').Range, u = function () {
            this.HighlightRules = s;
        };
    r.inherits(u, i), function () {
        this.lineCommentStart = '--', this.$id = 'ace/mode/sql';
    }.call(u.prototype), t.Mode = u;
});