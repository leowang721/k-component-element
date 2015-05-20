/*! @2015 Leo Wang. All Rights Reserved */
define('ace/mode/folding/coffee', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/folding/fold_mode',
    'ace/range'
], function (e, t, n) {
    'use strict';
    var r = e('../../lib/oop'), i = e('./fold_mode').FoldMode, s = e('../../range').Range, o = t.FoldMode = function () {
        };
    r.inherits(o, i), function () {
        this.getFoldWidgetRange = function (e, t, n) {
            var r = this.indentationBlock(e, n);
            if (r)
                return r;
            var i = /\S/, o = e.getLine(n), u = o.search(i);
            if (u == -1 || o[u] != '#')
                return;
            var a = o.length, f = e.getLength(), l = n, c = n;
            while (++n < f) {
                o = e.getLine(n);
                var h = o.search(i);
                if (h == -1)
                    continue;
                if (o[h] != '#')
                    break;
                c = n;
            }
            if (c > l) {
                var p = e.getLine(c).length;
                return new s(l, a, c, p);
            }
        }, this.getFoldWidget = function (e, t, n) {
            var r = e.getLine(n), i = r.search(/\S/), s = e.getLine(n + 1), o = e.getLine(n - 1), u = o.search(/\S/), a = s.search(/\S/);
            if (i == -1)
                return e.foldWidgets[n - 1] = u != -1 && u < a ? 'start' : '', '';
            if (u == -1) {
                if (i == a && r[i] == '#' && s[i] == '#')
                    return e.foldWidgets[n - 1] = '', e.foldWidgets[n + 1] = '', 'start';
            } else if (u == i && r[i] == '#' && o[i] == '#' && e.getLine(n - 2).search(/\S/) == -1)
                return e.foldWidgets[n - 1] = 'start', e.foldWidgets[n + 1] = '', '';
            return u != -1 && u < i ? e.foldWidgets[n - 1] = 'start' : e.foldWidgets[n - 1] = '', i < a ? 'start' : '';
        };
    }.call(o.prototype);
}), define('ace/mode/space_highlight_rules', [
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
                    {
                        token: 'empty_line',
                        regex: / */,
                        next: 'key'
                    },
                    {
                        token: 'empty_line',
                        regex: /$/,
                        next: 'key'
                    }
                ],
                key: [
                    {
                        token: 'variable',
                        regex: /\S+/
                    },
                    {
                        token: 'empty_line',
                        regex: /$/,
                        next: 'start'
                    },
                    {
                        token: 'keyword.operator',
                        regex: / /,
                        next: 'value'
                    }
                ],
                value: [
                    {
                        token: 'keyword.operator',
                        regex: /$/,
                        next: 'start'
                    },
                    {
                        token: 'string',
                        regex: /[^$]/
                    }
                ]
            };
        };
    r.inherits(s, i), t.SpaceHighlightRules = s;
}), define('ace/mode/space', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text',
    'ace/mode/folding/coffee',
    'ace/mode/space_highlight_rules'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('./text').Mode, s = e('./folding/coffee').FoldMode, o = e('./space_highlight_rules').SpaceHighlightRules, u = function () {
            this.HighlightRules = o, this.foldingRules = new s();
        };
    r.inherits(u, i), function () {
        this.$id = 'ace/mode/space';
    }.call(u.prototype), t.Mode = u;
});