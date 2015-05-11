'no use strict';
(function (e) {
    if (typeof e.window != 'undefined' && e.document)
        return;
    e.console = function () {
        var e = Array.prototype.slice.call(arguments, 0);
        postMessage({
            type: 'log',
            data: e
        });
    }, e.console.error = e.console.warn = e.console.log = e.console.trace = e.console, e.window = e, e.ace = e, e.onerror = function (e, t, n, r, i) {
        postMessage({
            type: 'error',
            data: {
                message: e,
                file: t,
                line: n,
                col: r,
                stack: i.stack
            }
        });
    }, e.normalizeModule = function (t, n) {
        if (n.indexOf('!') !== -1) {
            var r = n.split('!');
            return e.normalizeModule(t, r[0]) + '!' + e.normalizeModule(t, r[1]);
        }
        if (n.charAt(0) == '.') {
            var i = t.split('/').slice(0, -1).join('/');
            n = (i ? i + '/' : '') + n;
            while (n.indexOf('.') !== -1 && s != n) {
                var s = n;
                n = n.replace(/^\.\//, '').replace(/\/\.\//, '/').replace(/[^\/]+\/\.\.\//, '');
            }
        }
        return n;
    }, e.require = function (t, n) {
        n || (n = t, t = null);
        if (!n.charAt)
            throw new Error('worker.js require() accepts only (parentId, id) as arguments');
        n = e.normalizeModule(t, n);
        var r = e.require.modules[n];
        if (r)
            return r.initialized || (r.initialized = !0, r.exports = r.factory().exports), r.exports;
        var i = n.split('/');
        if (!e.require.tlns)
            return console.log('unable to load ' + n);
        i[0] = e.require.tlns[i[0]] || i[0];
        var s = i.join('/') + '.js';
        return e.require.id = n, importScripts(s), e.require(t, n);
    }, e.require.modules = {}, e.require.tlns = {}, e.define = function (t, n, r) {
        arguments.length == 2 ? (r = n, typeof t != 'string' && (n = t, t = e.require.id)) : arguments.length == 1 && (r = t, n = [], t = e.require.id);
        if (typeof r != 'function') {
            e.require.modules[t] = {
                exports: r,
                initialized: !0
            };
            return;
        }
        n.length || (n = [
            'require',
            'exports',
            'module'
        ]);
        var i = function (n) {
            return e.require(t, n);
        };
        e.require.modules[t] = {
            exports: {},
            factory: function () {
                var e = this, t = r.apply(this, n.map(function (t) {
                        switch (t) {
                        case 'require':
                            return i;
                        case 'exports':
                            return e.exports;
                        case 'module':
                            return e;
                        default:
                            return i(t);
                        }
                    }));
                return t && (e.exports = t), e;
            }
        };
    }, e.define.amd = {}, e.initBaseUrls = function (t) {
        require.tlns = t;
    }, e.initSender = function () {
        var n = e.require('ace/lib/event_emitter').EventEmitter, r = e.require('ace/lib/oop'), i = function () {
            };
        return function () {
            r.implement(this, n), this.callback = function (e, t) {
                postMessage({
                    type: 'call',
                    id: t,
                    data: e
                });
            }, this.emit = function (e, t) {
                postMessage({
                    type: 'event',
                    name: e,
                    data: t
                });
            };
        }.call(i.prototype), new i();
    };
    var t = e.main = null, n = e.sender = null;
    e.onmessage = function (r) {
        var i = r.data;
        if (i.command) {
            if (!t[i.command])
                throw new Error('Unknown command:' + i.command);
            t[i.command].apply(t, i.args);
        } else if (i.init) {
            initBaseUrls(i.tlns), require('ace/lib/es5-shim'), n = e.sender = initSender();
            var s = require(i.module)[i.classname];
            t = e.main = new s(n);
        } else
            i.event && n && n._signal(i.event, i.data);
    };
}(this), define('ace/lib/oop', [
    'require',
    'exports',
    'module'
], function (e, t, n) {
    'use strict';
    t.inherits = function (e, t) {
        e.super_ = t, e.prototype = Object.create(t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        });
    }, t.mixin = function (e, t) {
        for (var n in t)
            e[n] = t[n];
        return e;
    }, t.implement = function (e, n) {
        t.mixin(e, n);
    };
}), define('ace/lib/event_emitter', [
    'require',
    'exports',
    'module'
], function (e, t, n) {
    'use strict';
    var r = {}, i = function () {
            this.propagationStopped = !0;
        }, s = function () {
            this.defaultPrevented = !0;
        };
    r._emit = r._dispatchEvent = function (e, t) {
        this._eventRegistry || (this._eventRegistry = {}), this._defaultHandlers || (this._defaultHandlers = {});
        var n = this._eventRegistry[e] || [], r = this._defaultHandlers[e];
        if (!n.length && !r)
            return;
        if (typeof t != 'object' || !t)
            t = {};
        t.type || (t.type = e), t.stopPropagation || (t.stopPropagation = i), t.preventDefault || (t.preventDefault = s), n = n.slice();
        for (var o = 0; o < n.length; o++) {
            n[o](t, this);
            if (t.propagationStopped)
                break;
        }
        if (r && !t.defaultPrevented)
            return r(t, this);
    }, r._signal = function (e, t) {
        var n = (this._eventRegistry || {})[e];
        if (!n)
            return;
        n = n.slice();
        for (var r = 0; r < n.length; r++)
            n[r](t, this);
    }, r.once = function (e, t) {
        var n = this;
        t && this.addEventListener(e, function r() {
            n.removeEventListener(e, r), t.apply(null, arguments);
        });
    }, r.setDefaultHandler = function (e, t) {
        var n = this._defaultHandlers;
        n || (n = this._defaultHandlers = { _disabled_: {} });
        if (n[e]) {
            var r = n[e], i = n._disabled_[e];
            i || (n._disabled_[e] = i = []), i.push(r);
            var s = i.indexOf(t);
            s != -1 && i.splice(s, 1);
        }
        n[e] = t;
    }, r.removeDefaultHandler = function (e, t) {
        var n = this._defaultHandlers;
        if (!n)
            return;
        var r = n._disabled_[e];
        if (n[e] == t) {
            var i = n[e];
            r && this.setDefaultHandler(e, r.pop());
        } else if (r) {
            var s = r.indexOf(t);
            s != -1 && r.splice(s, 1);
        }
    }, r.on = r.addEventListener = function (e, t, n) {
        this._eventRegistry = this._eventRegistry || {};
        var r = this._eventRegistry[e];
        return r || (r = this._eventRegistry[e] = []), r.indexOf(t) == -1 && r[n ? 'unshift' : 'push'](t), t;
    }, r.off = r.removeListener = r.removeEventListener = function (e, t) {
        this._eventRegistry = this._eventRegistry || {};
        var n = this._eventRegistry[e];
        if (!n)
            return;
        var r = n.indexOf(t);
        r !== -1 && n.splice(r, 1);
    }, r.removeAllListeners = function (e) {
        this._eventRegistry && (this._eventRegistry[e] = []);
    }, t.EventEmitter = r;
}), define('ace/range', [
    'require',
    'exports',
    'module'
], function (e, t, n) {
    'use strict';
    var r = function (e, t) {
            return e.row - t.row || e.column - t.column;
        }, i = function (e, t, n, r) {
            this.start = {
                row: e,
                column: t
            }, this.end = {
                row: n,
                column: r
            };
        };
    (function () {
        this.isEqual = function (e) {
            return this.start.row === e.start.row && this.end.row === e.end.row && this.start.column === e.start.column && this.end.column === e.end.column;
        }, this.toString = function () {
            return 'Range: [' + this.start.row + '/' + this.start.column + '] -> [' + this.end.row + '/' + this.end.column + ']';
        }, this.contains = function (e, t) {
            return this.compare(e, t) == 0;
        }, this.compareRange = function (e) {
            var t, n = e.end, r = e.start;
            return t = this.compare(n.row, n.column), t == 1 ? (t = this.compare(r.row, r.column), t == 1 ? 2 : t == 0 ? 1 : 0) : t == -1 ? -2 : (t = this.compare(r.row, r.column), t == -1 ? -1 : t == 1 ? 42 : 0);
        }, this.comparePoint = function (e) {
            return this.compare(e.row, e.column);
        }, this.containsRange = function (e) {
            return this.comparePoint(e.start) == 0 && this.comparePoint(e.end) == 0;
        }, this.intersects = function (e) {
            var t = this.compareRange(e);
            return t == -1 || t == 0 || t == 1;
        }, this.isEnd = function (e, t) {
            return this.end.row == e && this.end.column == t;
        }, this.isStart = function (e, t) {
            return this.start.row == e && this.start.column == t;
        }, this.setStart = function (e, t) {
            typeof e == 'object' ? (this.start.column = e.column, this.start.row = e.row) : (this.start.row = e, this.start.column = t);
        }, this.setEnd = function (e, t) {
            typeof e == 'object' ? (this.end.column = e.column, this.end.row = e.row) : (this.end.row = e, this.end.column = t);
        }, this.inside = function (e, t) {
            return this.compare(e, t) == 0 ? this.isEnd(e, t) || this.isStart(e, t) ? !1 : !0 : !1;
        }, this.insideStart = function (e, t) {
            return this.compare(e, t) == 0 ? this.isEnd(e, t) ? !1 : !0 : !1;
        }, this.insideEnd = function (e, t) {
            return this.compare(e, t) == 0 ? this.isStart(e, t) ? !1 : !0 : !1;
        }, this.compare = function (e, t) {
            return !this.isMultiLine() && e === this.start.row ? t < this.start.column ? -1 : t > this.end.column ? 1 : 0 : e < this.start.row ? -1 : e > this.end.row ? 1 : this.start.row === e ? t >= this.start.column ? 0 : -1 : this.end.row === e ? t <= this.end.column ? 0 : 1 : 0;
        }, this.compareStart = function (e, t) {
            return this.start.row == e && this.start.column == t ? -1 : this.compare(e, t);
        }, this.compareEnd = function (e, t) {
            return this.end.row == e && this.end.column == t ? 1 : this.compare(e, t);
        }, this.compareInside = function (e, t) {
            return this.end.row == e && this.end.column == t ? 1 : this.start.row == e && this.start.column == t ? -1 : this.compare(e, t);
        }, this.clipRows = function (e, t) {
            if (this.end.row > t)
                var n = {
                        row: t + 1,
                        column: 0
                    };
            else if (this.end.row < e)
                var n = {
                        row: e,
                        column: 0
                    };
            if (this.start.row > t)
                var r = {
                        row: t + 1,
                        column: 0
                    };
            else if (this.start.row < e)
                var r = {
                        row: e,
                        column: 0
                    };
            return i.fromPoints(r || this.start, n || this.end);
        }, this.extend = function (e, t) {
            var n = this.compare(e, t);
            if (n == 0)
                return this;
            if (n == -1)
                var r = {
                        row: e,
                        column: t
                    };
            else
                var s = {
                        row: e,
                        column: t
                    };
            return i.fromPoints(r || this.start, s || this.end);
        }, this.isEmpty = function () {
            return this.start.row === this.end.row && this.start.column === this.end.column;
        }, this.isMultiLine = function () {
            return this.start.row !== this.end.row;
        }, this.clone = function () {
            return i.fromPoints(this.start, this.end);
        }, this.collapseRows = function () {
            return this.end.column == 0 ? new i(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0) : new i(this.start.row, 0, this.end.row, 0);
        }, this.toScreenRange = function (e) {
            var t = e.documentToScreenPosition(this.start), n = e.documentToScreenPosition(this.end);
            return new i(t.row, t.column, n.row, n.column);
        }, this.moveBy = function (e, t) {
            this.start.row += e, this.start.column += t, this.end.row += e, this.end.column += t;
        };
    }.call(i.prototype), i.fromPoints = function (e, t) {
        return new i(e.row, e.column, t.row, t.column);
    }, i.comparePoints = r, i.comparePoints = function (e, t) {
        return e.row - t.row || e.column - t.column;
    }, t.Range = i);
}), define('ace/anchor', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/lib/event_emitter'
], function (e, t, n) {
    'use strict';
    var r = e('./lib/oop'), i = e('./lib/event_emitter').EventEmitter, s = t.Anchor = function (e, t, n) {
            this.$onChange = this.onChange.bind(this), this.attach(e), typeof n == 'undefined' ? this.setPosition(t.row, t.column) : this.setPosition(t, n);
        };
    (function () {
        r.implement(this, i), this.getPosition = function () {
            return this.$clipPositionToDocument(this.row, this.column);
        }, this.getDocument = function () {
            return this.document;
        }, this.$insertRight = !1, this.onChange = function (e) {
            var t = e.data, n = t.range;
            if (n.start.row == n.end.row && n.start.row != this.row)
                return;
            if (n.start.row > this.row)
                return;
            if (n.start.row == this.row && n.start.column > this.column)
                return;
            var r = this.row, i = this.column, s = n.start, o = n.end;
            if (t.action === 'insertText')
                if (s.row === r && s.column <= i) {
                    if (s.column !== i || !this.$insertRight)
                        s.row === o.row ? i += o.column - s.column : (i -= s.column, r += o.row - s.row);
                } else
                    s.row !== o.row && s.row < r && (r += o.row - s.row);
            else
                t.action === 'insertLines' ? (s.row !== r || i !== 0 || !this.$insertRight) && s.row <= r && (r += o.row - s.row) : t.action === 'removeText' ? s.row === r && s.column < i ? o.column >= i ? i = s.column : i = Math.max(0, i - (o.column - s.column)) : s.row !== o.row && s.row < r ? (o.row === r && (i = Math.max(0, i - o.column) + s.column), r -= o.row - s.row) : o.row === r && (r -= o.row - s.row, i = Math.max(0, i - o.column) + s.column) : t.action == 'removeLines' && s.row <= r && (o.row <= r ? r -= o.row - s.row : (r = s.row, i = 0));
            this.setPosition(r, i, !0);
        }, this.setPosition = function (e, t, n) {
            var r;
            n ? r = {
                row: e,
                column: t
            } : r = this.$clipPositionToDocument(e, t);
            if (this.row == r.row && this.column == r.column)
                return;
            var i = {
                    row: this.row,
                    column: this.column
                };
            this.row = r.row, this.column = r.column, this._signal('change', {
                old: i,
                value: r
            });
        }, this.detach = function () {
            this.document.removeEventListener('change', this.$onChange);
        }, this.attach = function (e) {
            this.document = e || this.document, this.document.on('change', this.$onChange);
        }, this.$clipPositionToDocument = function (e, t) {
            var n = {};
            return e >= this.document.getLength() ? (n.row = Math.max(0, this.document.getLength() - 1), n.column = this.document.getLine(n.row).length) : e < 0 ? (n.row = 0, n.column = 0) : (n.row = e, n.column = Math.min(this.document.getLine(n.row).length, Math.max(0, t))), t < 0 && (n.column = 0), n;
        };
    }.call(s.prototype));
}), define('ace/document', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/lib/event_emitter',
    'ace/range',
    'ace/anchor'
], function (e, t, n) {
    'use strict';
    var r = e('./lib/oop'), i = e('./lib/event_emitter').EventEmitter, s = e('./range').Range, o = e('./anchor').Anchor, u = function (e) {
            this.$lines = [], e.length === 0 ? this.$lines = [''] : Array.isArray(e) ? this._insertLines(0, e) : this.insert({
                row: 0,
                column: 0
            }, e);
        };
    (function () {
        r.implement(this, i), this.setValue = function (e) {
            var t = this.getLength();
            this.remove(new s(0, 0, t, this.getLine(t - 1).length)), this.insert({
                row: 0,
                column: 0
            }, e);
        }, this.getValue = function () {
            return this.getAllLines().join(this.getNewLineCharacter());
        }, this.createAnchor = function (e, t) {
            return new o(this, e, t);
        }, 'aaa'.split(/a/).length === 0 ? this.$split = function (e) {
            return e.replace(/\r\n|\r/g, '\n').split('\n');
        } : this.$split = function (e) {
            return e.split(/\r\n|\r|\n/);
        }, this.$detectNewLine = function (e) {
            var t = e.match(/^.*?(\r\n|\r|\n)/m);
            this.$autoNewLine = t ? t[1] : '\n', this._signal('changeNewLineMode');
        }, this.getNewLineCharacter = function () {
            switch (this.$newLineMode) {
            case 'windows':
                return '\r\n';
            case 'unix':
                return '\n';
            default:
                return this.$autoNewLine || '\n';
            }
        }, this.$autoNewLine = '', this.$newLineMode = 'auto', this.setNewLineMode = function (e) {
            if (this.$newLineMode === e)
                return;
            this.$newLineMode = e, this._signal('changeNewLineMode');
        }, this.getNewLineMode = function () {
            return this.$newLineMode;
        }, this.isNewLine = function (e) {
            return e == '\r\n' || e == '\r' || e == '\n';
        }, this.getLine = function (e) {
            return this.$lines[e] || '';
        }, this.getLines = function (e, t) {
            return this.$lines.slice(e, t + 1);
        }, this.getAllLines = function () {
            return this.getLines(0, this.getLength());
        }, this.getLength = function () {
            return this.$lines.length;
        }, this.getTextRange = function (e) {
            if (e.start.row == e.end.row)
                return this.getLine(e.start.row).substring(e.start.column, e.end.column);
            var t = this.getLines(e.start.row, e.end.row);
            t[0] = (t[0] || '').substring(e.start.column);
            var n = t.length - 1;
            return e.end.row - e.start.row == n && (t[n] = t[n].substring(0, e.end.column)), t.join(this.getNewLineCharacter());
        }, this.$clipPosition = function (e) {
            var t = this.getLength();
            return e.row >= t ? (e.row = Math.max(0, t - 1), e.column = this.getLine(t - 1).length) : e.row < 0 && (e.row = 0), e;
        }, this.insert = function (e, t) {
            if (!t || t.length === 0)
                return e;
            e = this.$clipPosition(e), this.getLength() <= 1 && this.$detectNewLine(t);
            var n = this.$split(t), r = n.splice(0, 1)[0], i = n.length == 0 ? null : n.splice(n.length - 1, 1)[0];
            return e = this.insertInLine(e, r), i !== null && (e = this.insertNewLine(e), e = this._insertLines(e.row, n), e = this.insertInLine(e, i || '')), e;
        }, this.insertLines = function (e, t) {
            return e >= this.getLength() ? this.insert({
                row: e,
                column: 0
            }, '\n' + t.join('\n')) : this._insertLines(Math.max(e, 0), t);
        }, this._insertLines = function (e, t) {
            if (t.length == 0)
                return {
                    row: e,
                    column: 0
                };
            while (t.length > 20000) {
                var n = this._insertLines(e, t.slice(0, 20000));
                t = t.slice(20000), e = n.row;
            }
            var r = [
                    e,
                    0
                ];
            r.push.apply(r, t), this.$lines.splice.apply(this.$lines, r);
            var i = new s(e, 0, e + t.length, 0), o = {
                    action: 'insertLines',
                    range: i,
                    lines: t
                };
            return this._signal('change', { data: o }), i.end;
        }, this.insertNewLine = function (e) {
            e = this.$clipPosition(e);
            var t = this.$lines[e.row] || '';
            this.$lines[e.row] = t.substring(0, e.column), this.$lines.splice(e.row + 1, 0, t.substring(e.column, t.length));
            var n = {
                    row: e.row + 1,
                    column: 0
                }, r = {
                    action: 'insertText',
                    range: s.fromPoints(e, n),
                    text: this.getNewLineCharacter()
                };
            return this._signal('change', { data: r }), n;
        }, this.insertInLine = function (e, t) {
            if (t.length == 0)
                return e;
            var n = this.$lines[e.row] || '';
            this.$lines[e.row] = n.substring(0, e.column) + t + n.substring(e.column);
            var r = {
                    row: e.row,
                    column: e.column + t.length
                }, i = {
                    action: 'insertText',
                    range: s.fromPoints(e, r),
                    text: t
                };
            return this._signal('change', { data: i }), r;
        }, this.remove = function (e) {
            e instanceof s || (e = s.fromPoints(e.start, e.end)), e.start = this.$clipPosition(e.start), e.end = this.$clipPosition(e.end);
            if (e.isEmpty())
                return e.start;
            var t = e.start.row, n = e.end.row;
            if (e.isMultiLine()) {
                var r = e.start.column == 0 ? t : t + 1, i = n - 1;
                e.end.column > 0 && this.removeInLine(n, 0, e.end.column), i >= r && this._removeLines(r, i), r != t && (this.removeInLine(t, e.start.column, this.getLine(t).length), this.removeNewLine(e.start.row));
            } else
                this.removeInLine(t, e.start.column, e.end.column);
            return e.start;
        }, this.removeInLine = function (e, t, n) {
            if (t == n)
                return;
            var r = new s(e, t, e, n), i = this.getLine(e), o = i.substring(t, n), u = i.substring(0, t) + i.substring(n, i.length);
            this.$lines.splice(e, 1, u);
            var a = {
                    action: 'removeText',
                    range: r,
                    text: o
                };
            return this._signal('change', { data: a }), r.start;
        }, this.removeLines = function (e, t) {
            return e < 0 || t >= this.getLength() ? this.remove(new s(e, 0, t + 1, 0)) : this._removeLines(e, t);
        }, this._removeLines = function (e, t) {
            var n = new s(e, 0, t + 1, 0), r = this.$lines.splice(e, t - e + 1), i = {
                    action: 'removeLines',
                    range: n,
                    nl: this.getNewLineCharacter(),
                    lines: r
                };
            return this._signal('change', { data: i }), r;
        }, this.removeNewLine = function (e) {
            var t = this.getLine(e), n = this.getLine(e + 1), r = new s(e, t.length, e + 1, 0), i = t + n;
            this.$lines.splice(e, 2, i);
            var o = {
                    action: 'removeText',
                    range: r,
                    text: this.getNewLineCharacter()
                };
            this._signal('change', { data: o });
        }, this.replace = function (e, t) {
            e instanceof s || (e = s.fromPoints(e.start, e.end));
            if (t.length == 0 && e.isEmpty())
                return e.start;
            if (t == this.getTextRange(e))
                return e.end;
            this.remove(e);
            if (t)
                var n = this.insert(e.start, t);
            else
                n = e.start;
            return n;
        }, this.applyDeltas = function (e) {
            for (var t = 0; t < e.length; t++) {
                var n = e[t], r = s.fromPoints(n.range.start, n.range.end);
                n.action == 'insertLines' ? this.insertLines(r.start.row, n.lines) : n.action == 'insertText' ? this.insert(r.start, n.text) : n.action == 'removeLines' ? this._removeLines(r.start.row, r.end.row - 1) : n.action == 'removeText' && this.remove(r);
            }
        }, this.revertDeltas = function (e) {
            for (var t = e.length - 1; t >= 0; t--) {
                var n = e[t], r = s.fromPoints(n.range.start, n.range.end);
                n.action == 'insertLines' ? this._removeLines(r.start.row, r.end.row - 1) : n.action == 'insertText' ? this.remove(r) : n.action == 'removeLines' ? this._insertLines(r.start.row, n.lines) : n.action == 'removeText' && this.insert(r.start, n.text);
            }
        }, this.indexToPosition = function (e, t) {
            var n = this.$lines || this.getAllLines(), r = this.getNewLineCharacter().length;
            for (var i = t || 0, s = n.length; i < s; i++) {
                e -= n[i].length + r;
                if (e < 0)
                    return {
                        row: i,
                        column: e + n[i].length + r
                    };
            }
            return {
                row: s - 1,
                column: n[s - 1].length
            };
        }, this.positionToIndex = function (e, t) {
            var n = this.$lines || this.getAllLines(), r = this.getNewLineCharacter().length, i = 0, s = Math.min(e.row, n.length);
            for (var o = t || 0; o < s; ++o)
                i += n[o].length + r;
            return i + e.column;
        };
    }.call(u.prototype), t.Document = u);
}), define('ace/lib/lang', [
    'require',
    'exports',
    'module'
], function (e, t, n) {
    'use strict';
    t.last = function (e) {
        return e[e.length - 1];
    }, t.stringReverse = function (e) {
        return e.split('').reverse().join('');
    }, t.stringRepeat = function (e, t) {
        var n = '';
        while (t > 0) {
            t & 1 && (n += e);
            if (t >>= 1)
                e += e;
        }
        return n;
    };
    var r = /^\s\s*/, i = /\s\s*$/;
    t.stringTrimLeft = function (e) {
        return e.replace(r, '');
    }, t.stringTrimRight = function (e) {
        return e.replace(i, '');
    }, t.copyObject = function (e) {
        var t = {};
        for (var n in e)
            t[n] = e[n];
        return t;
    }, t.copyArray = function (e) {
        var t = [];
        for (var n = 0, r = e.length; n < r; n++)
            e[n] && typeof e[n] == 'object' ? t[n] = this.copyObject(e[n]) : t[n] = e[n];
        return t;
    }, t.deepCopy = function s(e) {
        if (typeof e != 'object' || !e)
            return e;
        var t;
        if (Array.isArray(e)) {
            t = [];
            for (var n = 0; n < e.length; n++)
                t[n] = s(e[n]);
            return t;
        }
        var r = e.constructor;
        if (r === RegExp)
            return e;
        t = r();
        for (var n in e)
            t[n] = s(e[n]);
        return t;
    }, t.arrayToMap = function (e) {
        var t = {};
        for (var n = 0; n < e.length; n++)
            t[e[n]] = 1;
        return t;
    }, t.createMap = function (e) {
        var t = Object.create(null);
        for (var n in e)
            t[n] = e[n];
        return t;
    }, t.arrayRemove = function (e, t) {
        for (var n = 0; n <= e.length; n++)
            t === e[n] && e.splice(n, 1);
    }, t.escapeRegExp = function (e) {
        return e.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
    }, t.escapeHTML = function (e) {
        return e.replace(/&/g, '&#38;').replace(/"/g, '&#34;').replace(/'/g, '&#39;').replace(/</g, '&#60;');
    }, t.getMatchOffsets = function (e, t) {
        var n = [];
        return e.replace(t, function (e) {
            n.push({
                offset: arguments[arguments.length - 2],
                length: e.length
            });
        }), n;
    }, t.deferredCall = function (e) {
        var t = null, n = function () {
                t = null, e();
            }, r = function (e) {
                return r.cancel(), t = setTimeout(n, e || 0), r;
            };
        return r.schedule = r, r.call = function () {
            return this.cancel(), e(), r;
        }, r.cancel = function () {
            return clearTimeout(t), t = null, r;
        }, r.isPending = function () {
            return t;
        }, r;
    }, t.delayedCall = function (e, t) {
        var n = null, r = function () {
                n = null, e();
            }, i = function (e) {
                n == null && (n = setTimeout(r, e || t));
            };
        return i.delay = function (e) {
            n && clearTimeout(n), n = setTimeout(r, e || t);
        }, i.schedule = i, i.call = function () {
            this.cancel(), e();
        }, i.cancel = function () {
            n && clearTimeout(n), n = null;
        }, i.isPending = function () {
            return n;
        }, i;
    };
}), define('ace/worker/mirror', [
    'require',
    'exports',
    'module',
    'ace/document',
    'ace/lib/lang'
], function (e, t, n) {
    'use strict';
    var r = e('../document').Document, i = e('../lib/lang'), s = t.Mirror = function (e) {
            this.sender = e;
            var t = this.doc = new r(''), n = this.deferredUpdate = i.delayedCall(this.onUpdate.bind(this)), s = this;
            e.on('change', function (e) {
                t.applyDeltas(e.data);
                if (s.$timeout)
                    return n.schedule(s.$timeout);
                s.onUpdate();
            });
        };
    (function () {
        this.$timeout = 500, this.setTimeout = function (e) {
            this.$timeout = e;
        }, this.setValue = function (e) {
            this.doc.setValue(e), this.deferredUpdate.schedule(this.$timeout);
        }, this.getValue = function (e) {
            this.sender.callback(this.doc.getValue(), e);
        }, this.onUpdate = function () {
        }, this.isPending = function () {
            return this.deferredUpdate.isPending();
        };
    }.call(s.prototype));
}), define('ace/mode/lua/luaparse', [
    'require',
    'exports',
    'module'
], function (e, t, n) {
    (function (e, n, r) {
        r(t);
    }(this, 'luaparse', function (e) {
        'use strict';
        function m(e) {
            if (mt) {
                var t = vt.pop();
                t.complete(), n.locations && (e.loc = t.loc), n.ranges && (e.range = t.range);
            }
            return e;
        }
        function w(e, t, n) {
            for (var r = 0, i = e.length; r < i; r++)
                if (e[r][t] === n)
                    return r;
            return -1;
        }
        function E(e) {
            var t = g.call(arguments, 1);
            return e = e.replace(/%(\d)/g, function (e, n) {
                return '' + t[n - 1] || '';
            }), e;
        }
        function S() {
            var e = g.call(arguments), t = {}, n, r;
            for (var i = 0, s = e.length; i < s; i++) {
                n = e[i];
                for (r in n)
                    n.hasOwnProperty(r) && (t[r] = n[r]);
            }
            return t;
        }
        function x(e) {
            var t = E.apply(null, g.call(arguments, 1)), n, r;
            throw 'undefined' != typeof e.line ? (r = e.range[0] - e.lineStart, n = new SyntaxError(E('[%1:%2] %3', e.line, r, t)), n.line = e.line, n.index = e.range[0], n.column = r) : (r = C - D + 1, n = new SyntaxError(E('[%1:%2] %3', _, r, t)), n.index = C, n.line = _, n.column = r), n;
        }
        function T(e, t) {
            x(t, d.expectedToken, e, t.value);
        }
        function N(e, t) {
            'undefined' == typeof t && (t = A.value);
            if ('undefined' != typeof e.type) {
                var n;
                switch (e.type) {
                case o:
                    n = 'string';
                    break;
                case u:
                    n = 'keyword';
                    break;
                case a:
                    n = 'identifier';
                    break;
                case f:
                    n = 'number';
                    break;
                case l:
                    n = 'symbol';
                    break;
                case c:
                    n = 'boolean';
                    break;
                case h:
                    return x(e, d.unexpected, 'symbol', 'nil', t);
                }
                return x(e, d.unexpected, n, e.value, t);
            }
            return x(e, d.unexpected, 'symbol', e, t);
        }
        function P() {
            H();
            while (45 === t.charCodeAt(C) && 45 === t.charCodeAt(C + 1))
                X(), H();
            if (C >= r)
                return {
                    type: s,
                    value: '<eof>',
                    line: _,
                    lineStart: D,
                    range: [
                        C,
                        C
                    ]
                };
            var e = t.charCodeAt(C), n = t.charCodeAt(C + 1);
            M = C;
            if (et(e))
                return B();
            switch (e) {
            case 39:
            case 34:
                return I();
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
                return R();
            case 46:
                if (Y(n))
                    return R();
                if (46 === n)
                    return 46 === t.charCodeAt(C + 2) ? F() : j('..');
                return j('.');
            case 61:
                if (61 === n)
                    return j('==');
                return j('=');
            case 62:
                if (61 === n)
                    return j('>=');
                return j('>');
            case 60:
                if (61 === n)
                    return j('<=');
                return j('<');
            case 126:
                if (61 === n)
                    return j('~=');
                return x({}, d.expected, '=', '~');
            case 58:
                if (58 === n)
                    return j('::');
                return j(':');
            case 91:
                if (91 === n || 61 === n)
                    return q();
                return j('[');
            case 42:
            case 47:
            case 94:
            case 37:
            case 44:
            case 123:
            case 125:
            case 93:
            case 40:
            case 41:
            case 59:
            case 35:
            case 45:
            case 43:
                return j(t.charAt(C));
            }
            return N(t.charAt(C));
        }
        function H() {
            while (C < r) {
                var e = t.charCodeAt(C);
                if (Q(e))
                    C++;
                else {
                    if (!G(e))
                        break;
                    _++, D = ++C;
                }
            }
        }
        function B() {
            var e, n;
            while (tt(t.charCodeAt(++C)));
            return e = t.slice(M, C), nt(e) ? n = u : 'true' === e || 'false' === e ? (n = c, e = 'true' === e) : 'nil' === e ? (n = h, e = null) : n = a, {
                type: n,
                value: e,
                line: _,
                lineStart: D,
                range: [
                    M,
                    C
                ]
            };
        }
        function j(e) {
            return C += e.length, {
                type: l,
                value: e,
                line: _,
                lineStart: D,
                range: [
                    M,
                    C
                ]
            };
        }
        function F() {
            return C += 3, {
                type: p,
                value: '...',
                line: _,
                lineStart: D,
                range: [
                    M,
                    C
                ]
            };
        }
        function I() {
            var e = t.charCodeAt(C++), n = C, i = '', s;
            while (C < r) {
                s = t.charCodeAt(C++);
                if (e === s)
                    break;
                if (92 === s)
                    i += t.slice(n, C - 1) + W(), n = C;
                else if (C >= r || G(s))
                    i += t.slice(n, C - 1), x({}, d.unfinishedString, i + String.fromCharCode(s));
            }
            return i += t.slice(n, C - 1), {
                type: o,
                value: i,
                line: _,
                lineStart: D,
                range: [
                    M,
                    C
                ]
            };
        }
        function q() {
            var e = V();
            return !1 === e && x(k, d.expected, '[', k.value), {
                type: o,
                value: e,
                line: _,
                lineStart: D,
                range: [
                    M,
                    C
                ]
            };
        }
        function R() {
            var e = t.charAt(C), n = t.charAt(C + 1), r = '0' === e && 'xX'.indexOf(n || null) >= 0 ? U() : z();
            return {
                type: f,
                value: r,
                line: _,
                lineStart: D,
                range: [
                    M,
                    C
                ]
            };
        }
        function U() {
            var e = 0, n = 1, r = 1, i, s, o, u;
            u = C += 2, Z(t.charCodeAt(C)) || x({}, d.malformedNumber, t.slice(M, C));
            while (Z(t.charCodeAt(C)))
                C++;
            i = parseInt(t.slice(u, C), 16);
            if ('.' === t.charAt(C)) {
                s = ++C;
                while (Z(t.charCodeAt(C)))
                    C++;
                e = t.slice(s, C), e = s === C ? 0 : parseInt(e, 16) / Math.pow(16, C - s);
            }
            if ('pP'.indexOf(t.charAt(C) || null) >= 0) {
                C++, '+-'.indexOf(t.charAt(C) || null) >= 0 && (r = '+' === t.charAt(C++) ? 1 : -1), o = C, Y(t.charCodeAt(C)) || x({}, d.malformedNumber, t.slice(M, C));
                while (Y(t.charCodeAt(C)))
                    C++;
                n = t.slice(o, C), n = Math.pow(2, n * r);
            }
            return (i + e) * n;
        }
        function z() {
            while (Y(t.charCodeAt(C)))
                C++;
            if ('.' === t.charAt(C)) {
                C++;
                while (Y(t.charCodeAt(C)))
                    C++;
            }
            if ('eE'.indexOf(t.charAt(C) || null) >= 0) {
                C++, '+-'.indexOf(t.charAt(C) || null) >= 0 && C++, Y(t.charCodeAt(C)) || x({}, d.malformedNumber, t.slice(M, C));
                while (Y(t.charCodeAt(C)))
                    C++;
            }
            return parseFloat(t.slice(M, C));
        }
        function W() {
            var e = C;
            switch (t.charAt(C)) {
            case 'n':
                return C++, '\n';
            case 'r':
                return C++, '\r';
            case 't':
                return C++, '\t';
            case 'v':
                return C++, '\x0B';
            case 'b':
                return C++, '\b';
            case 'f':
                return C++, '\f';
            case 'z':
                return C++, H(), '';
            case 'x':
                if (Z(t.charCodeAt(C + 1)) && Z(t.charCodeAt(C + 2)))
                    return C += 3, '\\' + t.slice(e, C);
                return '\\' + t.charAt(C++);
            default:
                if (Y(t.charCodeAt(C))) {
                    while (Y(t.charCodeAt(++C)));
                    return '\\' + t.slice(e, C);
                }
                return t.charAt(C++);
            }
        }
        function X() {
            M = C, C += 2;
            var e = t.charAt(C), i = '', s = !1, o = C, u = D, a = _;
            '[' === e && (i = V(), !1 === i ? i = e : s = !0);
            if (!s) {
                while (C < r) {
                    if (G(t.charCodeAt(C)))
                        break;
                    C++;
                }
                n.comments && (i = t.slice(o, C));
            }
            if (n.comments) {
                var f = v.comment(i, t.slice(M, C));
                n.locations && (f.loc = {
                    start: {
                        line: a,
                        column: M - u
                    },
                    end: {
                        line: _,
                        column: C - D
                    }
                }), n.ranges && (f.range = [
                    M,
                    C
                ]), O.push(f);
            }
        }
        function V() {
            var e = 0, n = '', i = !1, s, o;
            C++;
            while ('=' === t.charAt(C + e))
                e++;
            if ('[' !== t.charAt(C + e))
                return !1;
            C += e + 1, G(t.charCodeAt(C)) && (_++, D = C++), o = C;
            while (C < r) {
                s = t.charAt(C++), G(s.charCodeAt(0)) && (_++, D = C);
                if (']' === s) {
                    i = !0;
                    for (var u = 0; u < e; u++)
                        '=' !== t.charAt(C + u) && (i = !1);
                    ']' !== t.charAt(C + e) && (i = !1);
                }
                if (i)
                    break;
            }
            return n += t.slice(o, C - 1), C += e + 1, n;
        }
        function $() {
            L = k, k = A, A = P();
        }
        function J(e) {
            return e === k.value ? ($(), !0) : !1;
        }
        function K(e) {
            e === k.value ? $() : x(k, d.expected, e, k.value);
        }
        function Q(e) {
            return 9 === e || 32 === e || 11 === e || 12 === e;
        }
        function G(e) {
            return 10 === e || 13 === e;
        }
        function Y(e) {
            return e >= 48 && e <= 57;
        }
        function Z(e) {
            return e >= 48 && e <= 57 || e >= 97 && e <= 102 || e >= 65 && e <= 70;
        }
        function et(e) {
            return e >= 65 && e <= 90 || e >= 97 && e <= 122 || 95 === e;
        }
        function tt(e) {
            return e >= 65 && e <= 90 || e >= 97 && e <= 122 || 95 === e || e >= 48 && e <= 57;
        }
        function nt(e) {
            switch (e.length) {
            case 2:
                return 'do' === e || 'if' === e || 'in' === e || 'or' === e;
            case 3:
                return 'and' === e || 'end' === e || 'for' === e || 'not' === e;
            case 4:
                return 'else' === e || 'goto' === e || 'then' === e;
            case 5:
                return 'break' === e || 'local' === e || 'until' === e || 'while' === e;
            case 6:
                return 'elseif' === e || 'repeat' === e || 'return' === e;
            case 8:
                return 'function' === e;
            }
            return !1;
        }
        function rt(e) {
            return l === e.type ? '#-'.indexOf(e.value) >= 0 : u === e.type ? 'not' === e.value : !1;
        }
        function it(e) {
            switch (e.type) {
            case 'CallExpression':
            case 'TableCallExpression':
            case 'StringCallExpression':
                return !0;
            }
            return !1;
        }
        function st(e) {
            if (s === e.type)
                return !0;
            if (u !== e.type)
                return !1;
            switch (e.value) {
            case 'else':
            case 'elseif':
            case 'end':
            case 'until':
                return !0;
            default:
                return !1;
            }
        }
        function ft() {
            ot.push(Array.apply(null, ot[ut++]));
        }
        function lt() {
            ot.pop(), ut--;
        }
        function ct(e) {
            if (-1 !== b(ot[ut], e))
                return;
            ot[ut].push(e);
        }
        function ht(e) {
            ct(e.name), pt(e, !0);
        }
        function pt(e, t) {
            !t && -1 === w(at, 'name', e.name) && at.push(e), e.isLocal = t;
        }
        function dt(e) {
            return -1 !== b(ot[ut], e);
        }
        function gt() {
            return new yt(k);
        }
        function yt(e) {
            n.locations && (this.loc = {
                start: {
                    line: e.line,
                    column: e.range[0] - e.lineStart
                },
                end: {
                    line: 0,
                    column: 0
                }
            }), n.ranges && (this.range = [
                e.range[0],
                0
            ]);
        }
        function bt() {
            mt && vt.push(gt());
        }
        function wt(e) {
            mt && vt.push(e);
        }
        function Et() {
            $(), bt();
            var e = St();
            return s !== k.type && N(k), mt && !e.length && (L = k), m(v.chunk(e));
        }
        function St(e) {
            var t = [], r;
            n.scope && ft();
            while (!st(k)) {
                if ('return' === k.value) {
                    t.push(xt());
                    break;
                }
                r = xt(), r && t.push(r);
            }
            return n.scope && lt(), t;
        }
        function xt() {
            bt();
            if (u === k.type)
                switch (k.value) {
                case 'local':
                    return $(), Dt();
                case 'if':
                    return $(), Mt();
                case 'return':
                    return $(), Ot();
                case 'function':
                    $();
                    var e = jt();
                    return Bt(e);
                case 'while':
                    return $(), Lt();
                case 'for':
                    return $(), _t();
                case 'repeat':
                    return $(), At();
                case 'break':
                    return $(), Nt();
                case 'do':
                    return $(), kt();
                case 'goto':
                    return $(), Ct();
                }
            if (l === k.type && J('::'))
                return Tt();
            mt && vt.pop();
            if (J(';'))
                return;
            return Pt();
        }
        function Tt() {
            var e = k.value, t = Ht();
            return n.scope && (ct('::' + e + '::'), pt(t, !0)), K('::'), m(v.labelStatement(t));
        }
        function Nt() {
            return m(v.breakStatement());
        }
        function Ct() {
            var e = k.value, t = Ht();
            return n.scope && (t.isLabel = dt('::' + e + '::')), m(v.gotoStatement(t));
        }
        function kt() {
            var e = St();
            return K('end'), m(v.doStatement(e));
        }
        function Lt() {
            var e = qt();
            K('do');
            var t = St();
            return K('end'), m(v.whileStatement(e, t));
        }
        function At() {
            var e = St();
            K('until');
            var t = qt();
            return m(v.repeatStatement(t, e));
        }
        function Ot() {
            var e = [];
            if ('end' !== k.value) {
                var t = It();
                null != t && e.push(t);
                while (J(','))
                    t = qt(), e.push(t);
                J(';');
            }
            return m(v.returnStatement(e));
        }
        function Mt() {
            var e = [], t, n, r;
            mt && (r = vt[vt.length - 1], vt.push(r)), t = qt(), K('then'), n = St(), e.push(m(v.ifClause(t, n))), mt && (r = gt());
            while (J('elseif'))
                wt(r), t = qt(), K('then'), n = St(), e.push(m(v.elseifClause(t, n))), mt && (r = gt());
            return J('else') && (mt && (r = new yt(L), vt.push(r)), n = St(), e.push(m(v.elseClause(n)))), K('end'), m(v.ifStatement(e));
        }
        function _t() {
            var e = Ht(), t;
            n.scope && ht(e);
            if (J('=')) {
                var r = qt();
                K(',');
                var i = qt(), s = J(',') ? qt() : null;
                return K('do'), t = St(), K('end'), m(v.forNumericStatement(e, r, i, s, t));
            }
            var o = [e];
            while (J(','))
                e = Ht(), n.scope && ht(e), o.push(e);
            K('in');
            var u = [];
            do {
                var a = qt();
                u.push(a);
            } while (J(','));
            return K('do'), t = St(), K('end'), m(v.forGenericStatement(o, u, t));
        }
        function Dt() {
            var e;
            if (a === k.type) {
                var t = [], r = [];
                do
                    e = Ht(), t.push(e);
                while (J(','));
                if (J('='))
                    do {
                        var i = qt();
                        r.push(i);
                    } while (J(','));
                if (n.scope)
                    for (var s = 0, o = t.length; s < o; s++)
                        ht(t[s]);
                return m(v.localStatement(t, r));
            }
            if (J('function'))
                return e = Ht(), n.scope && ht(e), Bt(e, !0);
            T('<name>', k);
        }
        function Pt() {
            var e = k, t, n;
            mt && (n = gt()), t = zt();
            if (null == t)
                return N(k);
            if (',='.indexOf(k.value) >= 0) {
                var r = [t], i = [], s;
                while (J(','))
                    s = zt(), null == s && T('<expression>', k), r.push(s);
                K('=');
                do
                    s = qt(), i.push(s);
                while (J(','));
                return wt(n), m(v.assignmentStatement(r, i));
            }
            return it(t) ? (wt(n), m(v.callStatement(t))) : N(e);
        }
        function Ht() {
            bt();
            var e = k.value;
            return a !== k.type && T('<name>', k), $(), m(v.identifier(e));
        }
        function Bt(e, t) {
            var r = [];
            K('(');
            if (!J(')'))
                for (;;)
                    if (a === k.type) {
                        var i = Ht();
                        n.scope && ht(i), r.push(i);
                        if (J(','))
                            continue;
                        if (J(')'))
                            break;
                    } else {
                        if (p === k.type) {
                            r.push(Xt()), K(')');
                            break;
                        }
                        T('<name> or \'...\'', k);
                    }
            var s = St();
            return K('end'), t = t || !1, m(v.functionStatement(e, r, t, s));
        }
        function jt() {
            var e, t, r;
            mt && (r = gt()), e = Ht(), n.scope && pt(e, !1);
            while (J('.'))
                wt(r), t = Ht(), n.scope && pt(t, !1), e = m(v.memberExpression(e, '.', t));
            return J(':') && (wt(r), t = Ht(), n.scope && pt(t, !1), e = m(v.memberExpression(e, ':', t))), e;
        }
        function Ft() {
            var e = [], t, n;
            for (;;) {
                bt();
                if (l === k.type && J('['))
                    t = qt(), K(']'), K('='), n = qt(), e.push(m(v.tableKey(t, n)));
                else if (a === k.type)
                    t = qt(), J('=') ? (n = qt(), e.push(m(v.tableKeyString(t, n)))) : e.push(m(v.tableValue(t)));
                else {
                    if (null == (n = It())) {
                        vt.pop();
                        break;
                    }
                    e.push(m(v.tableValue(n)));
                }
                if (',;'.indexOf(k.value) >= 0) {
                    $();
                    continue;
                }
                if ('}' === k.value)
                    break;
            }
            return K('}'), m(v.tableConstructorExpression(e));
        }
        function It() {
            var e = Ut(0);
            return e;
        }
        function qt() {
            var e = It();
            if (null != e)
                return e;
            T('<expression>', k);
        }
        function Rt(e) {
            var t = e.charCodeAt(0), n = e.length;
            if (1 === n)
                switch (t) {
                case 94:
                    return 10;
                case 42:
                case 47:
                case 37:
                    return 7;
                case 43:
                case 45:
                    return 6;
                case 60:
                case 62:
                    return 3;
                }
            else if (2 === n)
                switch (t) {
                case 46:
                    return 5;
                case 60:
                case 62:
                case 61:
                case 126:
                    return 3;
                case 111:
                    return 1;
                }
            else if (97 === t && 'and' === e)
                return 2;
            return 0;
        }
        function Ut(e) {
            var t = k.value, n, r;
            mt && (r = gt());
            if (rt(k)) {
                bt(), $();
                var i = Ut(8);
                i == null && T('<expression>', k), n = m(v.unaryExpression(t, i));
            }
            null == n && (n = Xt(), null == n && (n = zt()));
            if (null == n)
                return null;
            var s;
            for (;;) {
                t = k.value, s = l === k.type || u === k.type ? Rt(t) : 0;
                if (s === 0 || s <= e)
                    break;
                ('^' === t || '..' === t) && s--, $();
                var o = Ut(s);
                null == o && T('<expression>', k), mt && vt.push(r), n = m(v.binaryExpression(t, n, o));
            }
            return n;
        }
        function zt() {
            var e, t, r, i;
            mt && (r = gt());
            if (a === k.type)
                t = k.value, e = Ht(), n.scope && pt(e, i = dt(t));
            else {
                if (!J('('))
                    return null;
                e = qt(), K(')'), n.scope && (i = e.isLocal);
            }
            var s, u;
            for (;;)
                if (l === k.type)
                    switch (k.value) {
                    case '[':
                        wt(r), $(), s = qt(), e = m(v.indexExpression(e, s)), K(']');
                        break;
                    case '.':
                        wt(r), $(), u = Ht(), n.scope && pt(u, i), e = m(v.memberExpression(e, '.', u));
                        break;
                    case ':':
                        wt(r), $(), u = Ht(), n.scope && pt(u, i), e = m(v.memberExpression(e, ':', u)), wt(r), e = Wt(e);
                        break;
                    case '(':
                    case '{':
                        wt(r), e = Wt(e);
                        break;
                    default:
                        return e;
                    }
                else {
                    if (o !== k.type)
                        break;
                    wt(r), e = Wt(e);
                }
            return e;
        }
        function Wt(e) {
            if (l === k.type)
                switch (k.value) {
                case '(':
                    $();
                    var t = [], n = It();
                    null != n && t.push(n);
                    while (J(','))
                        n = qt(), t.push(n);
                    return K(')'), m(v.callExpression(e, t));
                case '{':
                    bt(), $();
                    var r = Ft();
                    return m(v.tableCallExpression(e, r));
                }
            else if (o === k.type)
                return m(v.stringCallExpression(e, Xt()));
            T('function arguments', k);
        }
        function Xt() {
            var e = o | f | c | h | p, n = k.value, r = k.type, i;
            mt && (i = gt());
            if (r & e) {
                wt(i);
                var s = t.slice(k.range[0], k.range[1]);
                return $(), m(v.literal(r, n, s));
            }
            if (u === r && 'function' === n)
                return wt(i), $(), Bt(null);
            if (J('{'))
                return wt(i), Ft();
        }
        function Vt(s, o) {
            return 'undefined' == typeof o && 'object' == typeof s && (o = s, s = undefined), o || (o = {}), t = s || '', n = S(i, o), C = 0, _ = 1, D = 0, r = t.length, ot = [[]], ut = 0, at = [], vt = [], n.comments && (O = []), n.wait ? e : Jt();
        }
        function $t(n) {
            return t += String(n), r = t.length, e;
        }
        function Jt(e) {
            'undefined' != typeof e && $t(e), r = t.length, mt = n.locations || n.ranges, A = P();
            var i = Et();
            n.comments && (i.comments = O), n.scope && (i.globals = at);
            if (vt.length > 0)
                throw new Error('Location tracking failed. This is most likely a bug in luaparse');
            return i;
        }
        e.version = '0.1.4';
        var t, n, r, i = e.defaultOptions = {
                wait: !1,
                comments: !0,
                scope: !1,
                locations: !1,
                ranges: !1
            }, s = 1, o = 2, u = 4, a = 8, f = 16, l = 32, c = 64, h = 128, p = 256;
        e.tokenTypes = {
            EOF: s,
            StringLiteral: o,
            Keyword: u,
            Identifier: a,
            NumericLiteral: f,
            Punctuator: l,
            BooleanLiteral: c,
            NilLiteral: h,
            VarargLiteral: p
        };
        var d = e.errors = {
                unexpected: 'Unexpected %1 \'%2\' near \'%3\'',
                expected: '\'%1\' expected near \'%2\'',
                expectedToken: '%1 expected near \'%2\'',
                unfinishedString: 'unfinished string near \'%1\'',
                malformedNumber: 'malformed number near \'%1\''
            }, v = e.ast = {
                labelStatement: function (e) {
                    return {
                        type: 'LabelStatement',
                        label: e
                    };
                },
                breakStatement: function () {
                    return { type: 'BreakStatement' };
                },
                gotoStatement: function (e) {
                    return {
                        type: 'GotoStatement',
                        label: e
                    };
                },
                returnStatement: function (e) {
                    return {
                        type: 'ReturnStatement',
                        arguments: e
                    };
                },
                ifStatement: function (e) {
                    return {
                        type: 'IfStatement',
                        clauses: e
                    };
                },
                ifClause: function (e, t) {
                    return {
                        type: 'IfClause',
                        condition: e,
                        body: t
                    };
                },
                elseifClause: function (e, t) {
                    return {
                        type: 'ElseifClause',
                        condition: e,
                        body: t
                    };
                },
                elseClause: function (e) {
                    return {
                        type: 'ElseClause',
                        body: e
                    };
                },
                whileStatement: function (e, t) {
                    return {
                        type: 'WhileStatement',
                        condition: e,
                        body: t
                    };
                },
                doStatement: function (e) {
                    return {
                        type: 'DoStatement',
                        body: e
                    };
                },
                repeatStatement: function (e, t) {
                    return {
                        type: 'RepeatStatement',
                        condition: e,
                        body: t
                    };
                },
                localStatement: function (e, t) {
                    return {
                        type: 'LocalStatement',
                        variables: e,
                        init: t
                    };
                },
                assignmentStatement: function (e, t) {
                    return {
                        type: 'AssignmentStatement',
                        variables: e,
                        init: t
                    };
                },
                callStatement: function (e) {
                    return {
                        type: 'CallStatement',
                        expression: e
                    };
                },
                functionStatement: function (e, t, n, r) {
                    return {
                        type: 'FunctionDeclaration',
                        identifier: e,
                        isLocal: n,
                        parameters: t,
                        body: r
                    };
                },
                forNumericStatement: function (e, t, n, r, i) {
                    return {
                        type: 'ForNumericStatement',
                        variable: e,
                        start: t,
                        end: n,
                        step: r,
                        body: i
                    };
                },
                forGenericStatement: function (e, t, n) {
                    return {
                        type: 'ForGenericStatement',
                        variables: e,
                        iterators: t,
                        body: n
                    };
                },
                chunk: function (e) {
                    return {
                        type: 'Chunk',
                        body: e
                    };
                },
                identifier: function (e) {
                    return {
                        type: 'Identifier',
                        name: e
                    };
                },
                literal: function (e, t, n) {
                    return e = e === o ? 'StringLiteral' : e === f ? 'NumericLiteral' : e === c ? 'BooleanLiteral' : e === h ? 'NilLiteral' : 'VarargLiteral', {
                        type: e,
                        value: t,
                        raw: n
                    };
                },
                tableKey: function (e, t) {
                    return {
                        type: 'TableKey',
                        key: e,
                        value: t
                    };
                },
                tableKeyString: function (e, t) {
                    return {
                        type: 'TableKeyString',
                        key: e,
                        value: t
                    };
                },
                tableValue: function (e) {
                    return {
                        type: 'TableValue',
                        value: e
                    };
                },
                tableConstructorExpression: function (e) {
                    return {
                        type: 'TableConstructorExpression',
                        fields: e
                    };
                },
                binaryExpression: function (e, t, n) {
                    var r = 'and' === e || 'or' === e ? 'LogicalExpression' : 'BinaryExpression';
                    return {
                        type: r,
                        operator: e,
                        left: t,
                        right: n
                    };
                },
                unaryExpression: function (e, t) {
                    return {
                        type: 'UnaryExpression',
                        operator: e,
                        argument: t
                    };
                },
                memberExpression: function (e, t, n) {
                    return {
                        type: 'MemberExpression',
                        indexer: t,
                        identifier: n,
                        base: e
                    };
                },
                indexExpression: function (e, t) {
                    return {
                        type: 'IndexExpression',
                        base: e,
                        index: t
                    };
                },
                callExpression: function (e, t) {
                    return {
                        type: 'CallExpression',
                        base: e,
                        arguments: t
                    };
                },
                tableCallExpression: function (e, t) {
                    return {
                        type: 'TableCallExpression',
                        base: e,
                        arguments: t
                    };
                },
                stringCallExpression: function (e, t) {
                    return {
                        type: 'StringCallExpression',
                        base: e,
                        argument: t
                    };
                },
                comment: function (e, t) {
                    return {
                        type: 'Comment',
                        value: e,
                        raw: t
                    };
                }
            }, g = Array.prototype.slice, y = Object.prototype.toString, b = function (t, n) {
                for (var r = 0, i = t.length; r < i; r++)
                    if (t[r] === n)
                        return r;
                return -1;
            }, C, k, L, A, O, M, _, D;
        e.lex = P;
        var ot, ut, at, vt = [], mt;
        yt.prototype.complete = function () {
            n.locations && (this.loc.end.line = L.line, this.loc.end.column = L.range[1] - L.lineStart), n.ranges && (this.range[1] = L.range[1]);
        }, e.parse = Vt, e.write = $t, e.end = Jt;
    }));
}), define('ace/mode/lua_worker', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/worker/mirror',
    'ace/mode/lua/luaparse'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('../worker/mirror').Mirror, s = e('../mode/lua/luaparse'), o = t.Worker = function (e) {
            i.call(this, e), this.setTimeout(500);
        };
    r.inherits(o, i), function () {
        this.onUpdate = function () {
            var e = this.doc.getValue(), t = [];
            try {
                s.parse(e);
            } catch (n) {
                n instanceof SyntaxError && t.push({
                    row: n.line - 1,
                    column: n.column,
                    text: n.message,
                    type: 'error'
                });
            }
            this.sender.emit('annotate', t);
        };
    }.call(o.prototype);
}), define('ace/lib/es5-shim', [
    'require',
    'exports',
    'module'
], function (e, t, n) {
    function r() {
    }
    function w(e) {
        try {
            return Object.defineProperty(e, 'sentinel', {}), 'sentinel' in e;
        } catch (t) {
        }
    }
    function H(e) {
        return e = +e, e !== e ? e = 0 : e !== 0 && e !== 1 / 0 && e !== -1 / 0 && (e = (e > 0 || -1) * Math.floor(Math.abs(e))), e;
    }
    function B(e) {
        var t = typeof e;
        return e === null || t === 'undefined' || t === 'boolean' || t === 'number' || t === 'string';
    }
    function j(e) {
        var t, n, r;
        if (B(e))
            return e;
        n = e.valueOf;
        if (typeof n == 'function') {
            t = n.call(e);
            if (B(t))
                return t;
        }
        r = e.toString;
        if (typeof r == 'function') {
            t = r.call(e);
            if (B(t))
                return t;
        }
        throw new TypeError();
    }
    Function.prototype.bind || (Function.prototype.bind = function (t) {
        var n = this;
        if (typeof n != 'function')
            throw new TypeError('Function.prototype.bind called on incompatible ' + n);
        var i = u.call(arguments, 1), s = function () {
                if (this instanceof s) {
                    var e = n.apply(this, i.concat(u.call(arguments)));
                    return Object(e) === e ? e : this;
                }
                return n.apply(t, i.concat(u.call(arguments)));
            };
        return n.prototype && (r.prototype = n.prototype, s.prototype = new r(), r.prototype = null), s;
    });
    var i = Function.prototype.call, s = Array.prototype, o = Object.prototype, u = s.slice, a = i.bind(o.toString), f = i.bind(o.hasOwnProperty), l, c, h, p, d;
    if (d = f(o, '__defineGetter__'))
        l = i.bind(o.__defineGetter__), c = i.bind(o.__defineSetter__), h = i.bind(o.__lookupGetter__), p = i.bind(o.__lookupSetter__);
    if ([
            1,
            2
        ].splice(0).length != 2)
        if (!function () {
                function e(e) {
                    var t = new Array(e + 2);
                    return t[0] = t[1] = 0, t;
                }
                var t = [], n;
                t.splice.apply(t, e(20)), t.splice.apply(t, e(26)), n = t.length, t.splice(5, 0, 'XXX'), n + 1 == t.length;
                if (n + 1 == t.length)
                    return !0;
            }())
            Array.prototype.splice = function (e, t) {
                var n = this.length;
                e > 0 ? e > n && (e = n) : e == void 0 ? e = 0 : e < 0 && (e = Math.max(n + e, 0)), e + t < n || (t = n - e);
                var r = this.slice(e, e + t), i = u.call(arguments, 2), s = i.length;
                if (e === n)
                    s && this.push.apply(this, i);
                else {
                    var o = Math.min(t, n - e), a = e + o, f = a + s - o, l = n - a, c = n - o;
                    if (f < a)
                        for (var h = 0; h < l; ++h)
                            this[f + h] = this[a + h];
                    else if (f > a)
                        for (h = l; h--;)
                            this[f + h] = this[a + h];
                    if (s && e === c)
                        this.length = c, this.push.apply(this, i);
                    else {
                        this.length = c + s;
                        for (h = 0; h < s; ++h)
                            this[e + h] = i[h];
                    }
                }
                return r;
            };
        else {
            var v = Array.prototype.splice;
            Array.prototype.splice = function (e, t) {
                return arguments.length ? v.apply(this, [
                    e === void 0 ? 0 : e,
                    t === void 0 ? this.length - e : t
                ].concat(u.call(arguments, 2))) : [];
            };
        }
    Array.isArray || (Array.isArray = function (t) {
        return a(t) == '[object Array]';
    });
    var m = Object('a'), g = m[0] != 'a' || !(0 in m);
    Array.prototype.forEach || (Array.prototype.forEach = function (t) {
        var n = F(this), r = g && a(this) == '[object String]' ? this.split('') : n, i = arguments[1], s = -1, o = r.length >>> 0;
        if (a(t) != '[object Function]')
            throw new TypeError();
        while (++s < o)
            s in r && t.call(i, r[s], s, n);
    }), Array.prototype.map || (Array.prototype.map = function (t) {
        var n = F(this), r = g && a(this) == '[object String]' ? this.split('') : n, i = r.length >>> 0, s = Array(i), o = arguments[1];
        if (a(t) != '[object Function]')
            throw new TypeError(t + ' is not a function');
        for (var u = 0; u < i; u++)
            u in r && (s[u] = t.call(o, r[u], u, n));
        return s;
    }), Array.prototype.filter || (Array.prototype.filter = function (t) {
        var n = F(this), r = g && a(this) == '[object String]' ? this.split('') : n, i = r.length >>> 0, s = [], o, u = arguments[1];
        if (a(t) != '[object Function]')
            throw new TypeError(t + ' is not a function');
        for (var f = 0; f < i; f++)
            f in r && (o = r[f], t.call(u, o, f, n) && s.push(o));
        return s;
    }), Array.prototype.every || (Array.prototype.every = function (t) {
        var n = F(this), r = g && a(this) == '[object String]' ? this.split('') : n, i = r.length >>> 0, s = arguments[1];
        if (a(t) != '[object Function]')
            throw new TypeError(t + ' is not a function');
        for (var o = 0; o < i; o++)
            if (o in r && !t.call(s, r[o], o, n))
                return !1;
        return !0;
    }), Array.prototype.some || (Array.prototype.some = function (t) {
        var n = F(this), r = g && a(this) == '[object String]' ? this.split('') : n, i = r.length >>> 0, s = arguments[1];
        if (a(t) != '[object Function]')
            throw new TypeError(t + ' is not a function');
        for (var o = 0; o < i; o++)
            if (o in r && t.call(s, r[o], o, n))
                return !0;
        return !1;
    }), Array.prototype.reduce || (Array.prototype.reduce = function (t) {
        var n = F(this), r = g && a(this) == '[object String]' ? this.split('') : n, i = r.length >>> 0;
        if (a(t) != '[object Function]')
            throw new TypeError(t + ' is not a function');
        if (!i && arguments.length == 1)
            throw new TypeError('reduce of empty array with no initial value');
        var s = 0, o;
        if (arguments.length >= 2)
            o = arguments[1];
        else
            do {
                if (s in r) {
                    o = r[s++];
                    break;
                }
                if (++s >= i)
                    throw new TypeError('reduce of empty array with no initial value');
            } while (!0);
        for (; s < i; s++)
            s in r && (o = t.call(void 0, o, r[s], s, n));
        return o;
    }), Array.prototype.reduceRight || (Array.prototype.reduceRight = function (t) {
        var n = F(this), r = g && a(this) == '[object String]' ? this.split('') : n, i = r.length >>> 0;
        if (a(t) != '[object Function]')
            throw new TypeError(t + ' is not a function');
        if (!i && arguments.length == 1)
            throw new TypeError('reduceRight of empty array with no initial value');
        var s, o = i - 1;
        if (arguments.length >= 2)
            s = arguments[1];
        else
            do {
                if (o in r) {
                    s = r[o--];
                    break;
                }
                if (--o < 0)
                    throw new TypeError('reduceRight of empty array with no initial value');
            } while (!0);
        do
            o in this && (s = t.call(void 0, s, r[o], o, n));
        while (o--);
        return s;
    });
    if (!Array.prototype.indexOf || [
            0,
            1
        ].indexOf(1, 2) != -1)
        Array.prototype.indexOf = function (t) {
            var n = g && a(this) == '[object String]' ? this.split('') : F(this), r = n.length >>> 0;
            if (!r)
                return -1;
            var i = 0;
            arguments.length > 1 && (i = H(arguments[1])), i = i >= 0 ? i : Math.max(0, r + i);
            for (; i < r; i++)
                if (i in n && n[i] === t)
                    return i;
            return -1;
        };
    if (!Array.prototype.lastIndexOf || [
            0,
            1
        ].lastIndexOf(0, -3) != -1)
        Array.prototype.lastIndexOf = function (t) {
            var n = g && a(this) == '[object String]' ? this.split('') : F(this), r = n.length >>> 0;
            if (!r)
                return -1;
            var i = r - 1;
            arguments.length > 1 && (i = Math.min(i, H(arguments[1]))), i = i >= 0 ? i : r - Math.abs(i);
            for (; i >= 0; i--)
                if (i in n && t === n[i])
                    return i;
            return -1;
        };
    Object.getPrototypeOf || (Object.getPrototypeOf = function (t) {
        return t.__proto__ || (t.constructor ? t.constructor.prototype : o);
    });
    if (!Object.getOwnPropertyDescriptor) {
        var y = 'Object.getOwnPropertyDescriptor called on a non-object: ';
        Object.getOwnPropertyDescriptor = function (t, n) {
            if (typeof t != 'object' && typeof t != 'function' || t === null)
                throw new TypeError(y + t);
            if (!f(t, n))
                return;
            var r, i, s;
            r = {
                enumerable: !0,
                configurable: !0
            };
            if (d) {
                var u = t.__proto__;
                t.__proto__ = o;
                var i = h(t, n), s = p(t, n);
                t.__proto__ = u;
                if (i || s)
                    return i && (r.get = i), s && (r.set = s), r;
            }
            return r.value = t[n], r;
        };
    }
    Object.getOwnPropertyNames || (Object.getOwnPropertyNames = function (t) {
        return Object.keys(t);
    });
    if (!Object.create) {
        var b;
        Object.prototype.__proto__ === null ? b = function () {
            return { __proto__: null };
        } : b = function () {
            var e = {};
            for (var t in e)
                e[t] = null;
            return e.constructor = e.hasOwnProperty = e.propertyIsEnumerable = e.isPrototypeOf = e.toLocaleString = e.toString = e.valueOf = e.__proto__ = null, e;
        }, Object.create = function (t, n) {
            var r;
            if (t === null)
                r = b();
            else {
                if (typeof t != 'object')
                    throw new TypeError('typeof prototype[' + typeof t + '] != \'object\'');
                var i = function () {
                };
                i.prototype = t, r = new i(), r.__proto__ = t;
            }
            return n !== void 0 && Object.defineProperties(r, n), r;
        };
    }
    if (Object.defineProperty) {
        var E = w({}), S = typeof document == 'undefined' || w(document.createElement('div'));
        if (!E || !S)
            var x = Object.defineProperty;
    }
    if (!Object.defineProperty || x) {
        var T = 'Property description must be an object: ', N = 'Object.defineProperty called on non-object: ', C = 'getters & setters can not be defined on this javascript engine';
        Object.defineProperty = function (t, n, r) {
            if (typeof t != 'object' && typeof t != 'function' || t === null)
                throw new TypeError(N + t);
            if (typeof r != 'object' && typeof r != 'function' || r === null)
                throw new TypeError(T + r);
            if (x)
                try {
                    return x.call(Object, t, n, r);
                } catch (i) {
                }
            if (f(r, 'value'))
                if (d && (h(t, n) || p(t, n))) {
                    var s = t.__proto__;
                    t.__proto__ = o, delete t[n], t[n] = r.value, t.__proto__ = s;
                } else
                    t[n] = r.value;
            else {
                if (!d)
                    throw new TypeError(C);
                f(r, 'get') && l(t, n, r.get), f(r, 'set') && c(t, n, r.set);
            }
            return t;
        };
    }
    Object.defineProperties || (Object.defineProperties = function (t, n) {
        for (var r in n)
            f(n, r) && Object.defineProperty(t, r, n[r]);
        return t;
    }), Object.seal || (Object.seal = function (t) {
        return t;
    }), Object.freeze || (Object.freeze = function (t) {
        return t;
    });
    try {
        Object.freeze(function () {
        });
    } catch (k) {
        Object.freeze = function (t) {
            return function (n) {
                return typeof n == 'function' ? n : t(n);
            };
        }(Object.freeze);
    }
    Object.preventExtensions || (Object.preventExtensions = function (t) {
        return t;
    }), Object.isSealed || (Object.isSealed = function (t) {
        return !1;
    }), Object.isFrozen || (Object.isFrozen = function (t) {
        return !1;
    }), Object.isExtensible || (Object.isExtensible = function (t) {
        if (Object(t) === t)
            throw new TypeError();
        var n = '';
        while (f(t, n))
            n += '?';
        t[n] = !0;
        var r = f(t, n);
        return delete t[n], r;
    });
    if (!Object.keys) {
        var L = !0, A = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ], O = A.length;
        for (var M in { toString: null })
            L = !1;
        Object.keys = function I(e) {
            if (typeof e != 'object' && typeof e != 'function' || e === null)
                throw new TypeError('Object.keys called on a non-object');
            var I = [];
            for (var t in e)
                f(e, t) && I.push(t);
            if (L)
                for (var n = 0, r = O; n < r; n++) {
                    var i = A[n];
                    f(e, i) && I.push(i);
                }
            return I;
        };
    }
    Date.now || (Date.now = function () {
        return new Date().getTime();
    });
    var _ = '\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
    if (!String.prototype.trim || _.trim()) {
        _ = '[' + _ + ']';
        var D = new RegExp('^' + _ + _ + '*'), P = new RegExp(_ + _ + '*$');
        String.prototype.trim = function () {
            return String(this).replace(D, '').replace(P, '');
        };
    }
    var F = function (e) {
        if (e == null)
            throw new TypeError('can\'t convert ' + e + ' to object');
        return Object(e);
    };
}));