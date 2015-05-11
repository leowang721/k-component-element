define('ace/mode/vhdl_highlight_rules', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text_highlight_rules'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('./text_highlight_rules').TextHighlightRules, s = function () {
            var e = 'access|after|ailas|all|architecture|assert|attribute|begin|block|buffer|bus|case|component|configuration|disconnect|downto|else|elsif|end|entity|file|for|function|generate|generic|guarded|if|impure|in|inertial|inout|is|label|linkage|literal|loop|mapnew|next|of|on|open|others|out|port|process|pure|range|record|reject|report|return|select|shared|subtype|then|to|transport|type|unaffected|united|until|wait|when|while|with', t = 'bit|bit_vector|boolean|character|integer|line|natural|positive|real|register|severity|signal|signed|std_logic|std_logic_vector|string||text|time|unsigned|variable', n = 'array|constant', r = 'abs|and|mod|nand|nor|not|rem|rol|ror|sla|sll|srasrl|xnor|xor', i = 'true|false|null', s = this.createKeywordMapper({
                    'keyword.operator': r,
                    keyword: e,
                    'constant.language': i,
                    'storage.modifier': n,
                    'storage.type': t
                }, 'identifier', !0);
            this.$rules = {
                start: [
                    {
                        token: 'comment',
                        regex: '--.*$'
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
                        token: 'keyword',
                        regex: '\\s*(?:library|package|use)\\b'
                    },
                    {
                        token: s,
                        regex: '[a-zA-Z_$][a-zA-Z0-9_$]*\\b'
                    },
                    {
                        token: 'keyword.operator',
                        regex: '&|\\*|\\+|\\-|\\/|<|=|>|\\||=>|\\*\\*|:=|\\/=|>=|<=|<>'
                    },
                    {
                        token: 'punctuation.operator',
                        regex: '\\\'|\\:|\\,|\\;|\\.'
                    },
                    {
                        token: 'paren.lparen',
                        regex: '[[(]'
                    },
                    {
                        token: 'paren.rparen',
                        regex: '[\\])]'
                    },
                    {
                        token: 'text',
                        regex: '\\s+'
                    }
                ]
            };
        };
    r.inherits(s, i), t.VHDLHighlightRules = s;
}), define('ace/mode/vhdl', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text',
    'ace/mode/vhdl_highlight_rules',
    'ace/range'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('./text').Mode, s = e('./vhdl_highlight_rules').VHDLHighlightRules, o = e('../range').Range, u = function () {
            this.HighlightRules = s;
        };
    r.inherits(u, i), function () {
        this.lineCommentStart = '--', this.$id = 'ace/mode/vhdl';
    }.call(u.prototype), t.Mode = u;
});