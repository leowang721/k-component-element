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
}), define('ace/mode/xml/sax', [
    'require',
    'exports',
    'module'
], function (e, t, n) {
    function d() {
    }
    function v(e, t, n, r, i) {
        function s(e) {
            if (e > 65535) {
                e -= 65536;
                var t = 55296 + (e >> 10), n = 56320 + (e & 1023);
                return String.fromCharCode(t, n);
            }
            return String.fromCharCode(e);
        }
        function o(e) {
            var t = e.slice(1, -1);
            return t in n ? n[t] : t.charAt(0) === '#' ? s(parseInt(t.substr(1).replace('x', '0x'))) : (i.error('entity not found:' + e), e);
        }
        function u(t) {
            var n = e.substring(v, t).replace(/&#?\w+;/g, o);
            h && a(v), r.characters(n, 0, t - v), v = t;
        }
        function a(t, n) {
            while (t >= l && (n = c.exec(e)))
                f = n.index, l = f + n[0].length, h.lineNumber++;
            h.columnNumber = t - f + 1;
        }
        var f = 0, l = 0, c = /.+(?:\r\n?|\n)|.*$/g, h = r.locator, p = [{ currentNSMap: t }], d = {}, v = 0;
        for (;;) {
            var E = e.indexOf('<', v);
            if (E < 0) {
                if (!e.substr(v).match(/^\s*$/)) {
                    var N = r.document, C = N.createTextNode(e.substr(v));
                    N.appendChild(C), r.currentElement = C;
                }
                return;
            }
            E > v && u(E);
            switch (e.charAt(E + 1)) {
            case '/':
                var k = e.indexOf('>', E + 3), L = e.substring(E + 2, k), A;
                if (!(p.length > 1)) {
                    i.fatalError('end tag name not found for: ' + L);
                    break;
                }
                A = p.pop();
                var O = A.localNSMap;
                A.tagName != L && i.fatalError('end tag name: ' + L + ' does not match the current start tagName: ' + A.tagName), r.endElement(A.uri, A.localName, L);
                if (O)
                    for (var M in O)
                        r.endPrefixMapping(M);
                k++;
                break;
            case '?':
                h && a(E), k = x(e, E, r);
                break;
            case '!':
                h && a(E), k = S(e, E, r, i);
                break;
            default:
                try {
                    h && a(E);
                    var _ = new T(), k = g(e, E, _, o, i), D = _.length;
                    if (D && h) {
                        var P = m(h, {});
                        for (var E = 0; E < D; E++) {
                            var H = _[E];
                            a(H.offset), H.offset = m(h, {});
                        }
                        m(P, h);
                    }
                    !_.closed && w(e, k, _.tagName, d) && (_.closed = !0, n.nbsp || i.warning('unclosed xml attribute')), y(_, r, p), _.uri === 'http://www.w3.org/1999/xhtml' && !_.closed ? k = b(e, k, _.tagName, o, r) : k++;
                } catch (B) {
                    i.error('element parse error: ' + B), k = -1;
                }
            }
            k < 0 ? u(E + 1) : v = k;
        }
    }
    function m(e, t) {
        return t.lineNumber = e.lineNumber, t.columnNumber = e.columnNumber, t;
    }
    function g(e, t, n, r, i) {
        var s, d, v = ++t, m = o;
        for (;;) {
            var g = e.charAt(v);
            switch (g) {
            case '=':
                if (m === u)
                    s = e.slice(t, v), m = f;
                else {
                    if (m !== a)
                        throw new Error('attribute equal must after attrName');
                    m = f;
                }
                break;
            case '\'':
            case '"':
                if (m === f) {
                    t = v + 1, v = e.indexOf(g, t);
                    if (!(v > 0))
                        throw new Error('attribute value no end \'' + g + '\' match');
                    d = e.slice(t, v).replace(/&#?\w+;/g, r), n.add(s, d, t - 1), m = c;
                } else {
                    if (m != l)
                        throw new Error('attribute value must after "="');
                    d = e.slice(t, v).replace(/&#?\w+;/g, r), n.add(s, d, t), i.warning('attribute "' + s + '" missed start quot(' + g + ')!!'), t = v + 1, m = c;
                }
                break;
            case '/':
                switch (m) {
                case o:
                    n.setTagName(e.slice(t, v));
                case c:
                case h:
                case p:
                    m = p, n.closed = !0;
                case l:
                case u:
                case a:
                    break;
                default:
                    throw new Error('attribute invalid close char(\'/\')');
                }
                break;
            case '':
                i.error('unexpected end of input');
            case '>':
                switch (m) {
                case o:
                    n.setTagName(e.slice(t, v));
                case c:
                case h:
                case p:
                    break;
                case l:
                case u:
                    d = e.slice(t, v), d.slice(-1) === '/' && (n.closed = !0, d = d.slice(0, -1));
                case a:
                    m === a && (d = s), m == l ? (i.warning('attribute "' + d + '" missed quot(")!!'), n.add(s, d.replace(/&#?\w+;/g, r), t)) : (i.warning('attribute "' + d + '" missed value!! "' + d + '" instead!!'), n.add(d, d, t));
                    break;
                case f:
                    throw new Error('attribute value missed!!');
                }
                return v;
            case '\x80':
                g = ' ';
            default:
                if (g <= ' ')
                    switch (m) {
                    case o:
                        n.setTagName(e.slice(t, v)), m = h;
                        break;
                    case u:
                        s = e.slice(t, v), m = a;
                        break;
                    case l:
                        var d = e.slice(t, v).replace(/&#?\w+;/g, r);
                        i.warning('attribute "' + d + '" missed quot(")!!'), n.add(s, d, t);
                    case c:
                        m = h;
                    }
                else
                    switch (m) {
                    case a:
                        i.warning('attribute "' + s + '" missed value!! "' + s + '" instead!!'), n.add(s, s, t), t = v, m = u;
                        break;
                    case c:
                        i.warning('attribute space is required"' + s + '"!!');
                    case h:
                        m = u, t = v;
                        break;
                    case f:
                        m = l, t = v;
                        break;
                    case p:
                        throw new Error('elements closed character \'/\' and \'>\' must be connected to');
                    }
            }
            v++;
        }
    }
    function y(e, t, n) {
        var r = e.tagName, i = null, s = n[n.length - 1].currentNSMap, o = e.length;
        while (o--) {
            var u = e[o], a = u.qName, f = u.value, l = a.indexOf(':');
            if (l > 0)
                var c = u.prefix = a.slice(0, l), h = a.slice(l + 1), p = c === 'xmlns' && h;
            else
                h = a, c = null, p = a === 'xmlns' && '';
            u.localName = h, p !== !1 && (i == null && (i = {}, E(s, s = {})), s[p] = i[p] = f, u.uri = 'http://www.w3.org/2000/xmlns/', t.startPrefixMapping(p, f));
        }
        var o = e.length;
        while (o--) {
            u = e[o];
            var c = u.prefix;
            c && (c === 'xml' && (u.uri = 'http://www.w3.org/XML/1998/namespace'), c !== 'xmlns' && (u.uri = s[c]));
        }
        var l = r.indexOf(':');
        l > 0 ? (c = e.prefix = r.slice(0, l), h = e.localName = r.slice(l + 1)) : (c = null, h = e.localName = r);
        var d = e.uri = s[c || ''];
        t.startElement(d, h, r, e);
        if (e.closed) {
            t.endElement(d, h, r);
            if (i)
                for (c in i)
                    t.endPrefixMapping(c);
        } else
            e.currentNSMap = s, e.localNSMap = i, n.push(e);
    }
    function b(e, t, n, r, i) {
        if (/^(?:script|textarea)$/i.test(n)) {
            var s = e.indexOf('</' + n + '>', t), o = e.substring(t + 1, s);
            if (/[&<]/.test(o))
                return /^script$/i.test(n) ? (i.characters(o, 0, o.length), s) : (o = o.replace(/&#?\w+;/g, r), i.characters(o, 0, o.length), s);
        }
        return t + 1;
    }
    function w(e, t, n, r) {
        var i = r[n];
        return i == null && (i = r[n] = e.lastIndexOf('</' + n + '>')), i < t;
    }
    function E(e, t) {
        for (var n in e)
            t[n] = e[n];
    }
    function S(e, t, n, r) {
        var i = e.charAt(t + 2);
        switch (i) {
        case '-':
            if (e.charAt(t + 3) === '-') {
                var s = e.indexOf('-->', t + 4);
                return s > t ? (n.comment(e, t + 4, s - t - 4), s + 3) : (r.error('Unclosed comment'), -1);
            }
            return -1;
        default:
            if (e.substr(t + 3, 6) == 'CDATA[') {
                var s = e.indexOf(']]>', t + 9);
                return n.startCDATA(), n.characters(e, t + 9, s - t - 9), n.endCDATA(), s + 3;
            }
            var o = C(e, t), u = o.length;
            if (u > 1 && /!doctype/i.test(o[0][0])) {
                var a = o[1][0], f = u > 3 && /^public$/i.test(o[2][0]) && o[3][0], l = u > 4 && o[4][0], c = o[u - 1];
                return n.startDTD(a, f && f.replace(/^(['"])(.*?)\1$/, '$2'), l && l.replace(/^(['"])(.*?)\1$/, '$2')), n.endDTD(), c.index + c[0].length;
            }
        }
        return -1;
    }
    function x(e, t, n) {
        var r = e.indexOf('?>', t);
        if (r) {
            var i = e.substring(t, r).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
            if (i) {
                var s = i[0].length;
                return n.processingInstruction(i[1], i[2]), r + 2;
            }
            return -1;
        }
        return -1;
    }
    function T(e) {
    }
    function N(e, t) {
        return e.__proto__ = t, e;
    }
    function C(e, t) {
        var n, r = [], i = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
        i.lastIndex = t, i.exec(e);
        while (n = i.exec(e)) {
            r.push(n);
            if (n[1])
                return r;
        }
    }
    var r = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, i = new RegExp('[\\-\\.0-9' + r.source.slice(1, -1) + '\xB7\u0300-\u036F\\ux203F-\u2040]'), s = new RegExp('^' + r.source + i.source + '*(?::' + r.source + i.source + '*)?$'), o = 0, u = 1, a = 2, f = 3, l = 4, c = 5, h = 6, p = 7;
    return d.prototype = {
        parse: function (e, t, n) {
            var r = this.domBuilder;
            r.startDocument(), E(t, t = {}), v(e, t, n, r, this.errorHandler), r.endDocument();
        }
    }, T.prototype = {
        setTagName: function (e) {
            if (!s.test(e))
                throw new Error('invalid tagName:' + e);
            this.tagName = e;
        },
        add: function (e, t, n) {
            if (!s.test(e))
                throw new Error('invalid attribute:' + e);
            this[this.length++] = {
                qName: e,
                value: t,
                offset: n
            };
        },
        length: 0,
        getLocalName: function (e) {
            return this[e].localName;
        },
        getOffset: function (e) {
            return this[e].offset;
        },
        getQName: function (e) {
            return this[e].qName;
        },
        getURI: function (e) {
            return this[e].uri;
        },
        getValue: function (e) {
            return this[e].value;
        }
    }, N({}, N.prototype) instanceof N || (N = function (e, t) {
        function n() {
        }
        n.prototype = t, n = new n();
        for (t in e)
            n[t] = e[t];
        return n;
    }), d;
}), define('ace/mode/xml/dom', [
    'require',
    'exports',
    'module'
], function (e, t, n) {
    function r(e, t) {
        for (var n in e)
            t[n] = e[n];
    }
    function i(e, t) {
        var n = e.prototype;
        if (Object.create) {
            var i = Object.create(t.prototype);
            n.__proto__ = i;
        }
        if (!(n instanceof t)) {
            function s() {
            }
            s.prototype = t.prototype, s = new s(), r(n, s), e.prototype = n = s;
        }
        n.constructor != e && (typeof e != 'function' && console.error('unknow Class:' + e), n.constructor = e);
    }
    function B(e, t) {
        if (t instanceof Error)
            var n = t;
        else
            n = this, Error.call(this, w[e]), this.message = w[e], Error.captureStackTrace && Error.captureStackTrace(this, B);
        return n.code = e, t && (this.message = this.message + ': ' + t), n;
    }
    function j() {
    }
    function F(e, t) {
        this._node = e, this._refresh = t, I(this);
    }
    function I(e) {
        var t = e._node._inc || e._node.ownerDocument._inc;
        if (e._inc != t) {
            var n = e._refresh(e._node);
            gt(e, 'length', n.length), r(n, e), e._inc = t;
        }
    }
    function q() {
    }
    function R(e, t) {
        var n = e.length;
        while (n--)
            if (e[n] === t)
                return n;
    }
    function U(e, t, n, r) {
        r ? t[R(t, r)] = n : t[t.length++] = n;
        if (e) {
            n.ownerElement = e;
            var i = e.ownerDocument;
            i && (r && Q(i, e, r), K(i, e, n));
        }
    }
    function z(e, t, n) {
        var r = R(t, n);
        if (!(r >= 0))
            throw B(L, new Error());
        var i = t.length - 1;
        while (r < i)
            t[r] = t[++r];
        t.length = i;
        if (e) {
            var s = e.ownerDocument;
            s && (Q(s, e, n), n.ownerElement = null);
        }
    }
    function W(e) {
        this._features = {};
        if (e)
            for (var t in e)
                this._features = e[t];
    }
    function X() {
    }
    function V(e) {
        return e == '<' && '&lt;' || e == '>' && '&gt;' || e == '&' && '&amp;' || e == '"' && '&quot;' || '&#' + e.charCodeAt() + ';';
    }
    function $(e, t) {
        if (t(e))
            return !0;
        if (e = e.firstChild)
            do
                if ($(e, t))
                    return !0;
            while (e = e.nextSibling);
    }
    function J() {
    }
    function K(e, t, n) {
        e && e._inc++;
        var r = n.namespaceURI;
        r == 'http://www.w3.org/2000/xmlns/' && (t._nsMap[n.prefix ? n.localName : ''] = n.value);
    }
    function Q(e, t, n, r) {
        e && e._inc++;
        var i = n.namespaceURI;
        i == 'http://www.w3.org/2000/xmlns/' && delete t._nsMap[n.prefix ? n.localName : ''];
    }
    function G(e, t, n) {
        if (e && e._inc) {
            e._inc++;
            var r = t.childNodes;
            if (n)
                r[r.length++] = n;
            else {
                var i = t.firstChild, s = 0;
                while (i)
                    r[s++] = i, i = i.nextSibling;
                r.length = s;
            }
        }
    }
    function Y(e, t) {
        var n = t.previousSibling, r = t.nextSibling;
        return n ? n.nextSibling = r : e.firstChild = r, r ? r.previousSibling = n : e.lastChild = n, G(e.ownerDocument, e), t;
    }
    function Z(e, t, n) {
        var r = t.parentNode;
        r && r.removeChild(t);
        if (t.nodeType === g) {
            var i = t.firstChild;
            if (i == null)
                return t;
            var s = t.lastChild;
        } else
            i = s = t;
        var o = n ? n.previousSibling : e.lastChild;
        i.previousSibling = o, s.nextSibling = n, o ? o.nextSibling = i : e.firstChild = i, n == null ? e.lastChild = s : n.previousSibling = s;
        do
            i.parentNode = e;
        while (i !== s && (i = i.nextSibling));
        return G(e.ownerDocument || e, e), t.nodeType == g && (t.firstChild = t.lastChild = null), t;
    }
    function et(e, t) {
        var n = t.parentNode;
        if (n) {
            var r = e.lastChild;
            n.removeChild(t);
            var r = e.lastChild;
        }
        var r = e.lastChild;
        return t.parentNode = e, t.previousSibling = r, t.nextSibling = null, r ? r.nextSibling = t : e.firstChild = t, e.lastChild = t, G(e.ownerDocument, e, t), t;
    }
    function tt() {
        this._nsMap = {};
    }
    function nt() {
    }
    function rt() {
    }
    function it() {
    }
    function st() {
    }
    function ot() {
    }
    function ut() {
    }
    function at() {
    }
    function ft() {
    }
    function lt() {
    }
    function ct() {
    }
    function ht() {
    }
    function pt() {
    }
    function dt(e, t) {
        switch (e.nodeType) {
        case u:
            var n = e.attributes, r = n.length, i = e.firstChild, o = e.tagName, h = s === e.namespaceURI;
            t.push('<', o);
            for (var y = 0; y < r; y++)
                dt(n.item(y), t, h);
            if (i || h && !/^(?:meta|link|img|br|hr|input|button)$/i.test(o)) {
                t.push('>');
                if (h && /^script$/i.test(o))
                    i && t.push(i.data);
                else
                    while (i)
                        dt(i, t), i = i.nextSibling;
                t.push('</', o, '>');
            } else
                t.push('/>');
            return;
        case v:
        case g:
            var i = e.firstChild;
            while (i)
                dt(i, t), i = i.nextSibling;
            return;
        case a:
            return t.push(' ', e.name, '="', e.value.replace(/[<&"]/g, V), '"');
        case f:
            return t.push(e.data.replace(/[<&]/g, V));
        case l:
            return t.push('<![CDATA[', e.data, ']]>');
        case d:
            return t.push('<!--', e.data, '-->');
        case m:
            var b = e.publicId, w = e.systemId;
            t.push('<!DOCTYPE ', e.name);
            if (b)
                t.push(' PUBLIC "', b), w && w != '.' && t.push('" "', w), t.push('">');
            else if (w && w != '.')
                t.push(' SYSTEM "', w, '">');
            else {
                var E = e.internalSubset;
                E && t.push(' [', E, ']'), t.push('>');
            }
            return;
        case p:
            return t.push('<?', e.target, ' ', e.data, '?>');
        case c:
            return t.push('&', e.nodeName, ';');
        default:
            t.push('??', e.nodeName);
        }
    }
    function vt(e, t, n) {
        var r;
        switch (t.nodeType) {
        case u:
            r = t.cloneNode(!1), r.ownerDocument = e;
        case g:
            break;
        case a:
            n = !0;
        }
        r || (r = t.cloneNode(!1)), r.ownerDocument = e, r.parentNode = null;
        if (n) {
            var i = t.firstChild;
            while (i)
                r.appendChild(vt(e, i, n)), i = i.nextSibling;
        }
        return r;
    }
    function mt(e, t, n) {
        var r = new t.constructor();
        for (var i in t) {
            var s = t[i];
            typeof s != 'object' && s != r[i] && (r[i] = s);
        }
        t.childNodes && (r.childNodes = new j()), r.ownerDocument = e;
        switch (r.nodeType) {
        case u:
            var o = t.attributes, f = r.attributes = new q(), l = o.length;
            f._ownerElement = r;
            for (var c = 0; c < l; c++)
                r.setAttributeNode(mt(e, o.item(c), !0));
            break;
        case a:
            n = !0;
        }
        if (n) {
            var h = t.firstChild;
            while (h)
                r.appendChild(mt(e, h, n)), h = h.nextSibling;
        }
        return r;
    }
    function gt(e, t, n) {
        e[t] = n;
    }
    var s = 'http://www.w3.org/1999/xhtml', o = {}, u = o.ELEMENT_NODE = 1, a = o.ATTRIBUTE_NODE = 2, f = o.TEXT_NODE = 3, l = o.CDATA_SECTION_NODE = 4, c = o.ENTITY_REFERENCE_NODE = 5, h = o.ENTITY_NODE = 6, p = o.PROCESSING_INSTRUCTION_NODE = 7, d = o.COMMENT_NODE = 8, v = o.DOCUMENT_NODE = 9, m = o.DOCUMENT_TYPE_NODE = 10, g = o.DOCUMENT_FRAGMENT_NODE = 11, y = o.NOTATION_NODE = 12, b = {}, w = {}, E = b.INDEX_SIZE_ERR = (w[1] = 'Index size error', 1), S = b.DOMSTRING_SIZE_ERR = (w[2] = 'DOMString size error', 2), x = b.HIERARCHY_REQUEST_ERR = (w[3] = 'Hierarchy request error', 3), T = b.WRONG_DOCUMENT_ERR = (w[4] = 'Wrong document', 4), N = b.INVALID_CHARACTER_ERR = (w[5] = 'Invalid character', 5), C = b.NO_DATA_ALLOWED_ERR = (w[6] = 'No data allowed', 6), k = b.NO_MODIFICATION_ALLOWED_ERR = (w[7] = 'No modification allowed', 7), L = b.NOT_FOUND_ERR = (w[8] = 'Not found', 8), A = b.NOT_SUPPORTED_ERR = (w[9] = 'Not supported', 9), O = b.INUSE_ATTRIBUTE_ERR = (w[10] = 'Attribute in use', 10), M = b.INVALID_STATE_ERR = (w[11] = 'Invalid state', 11), _ = b.SYNTAX_ERR = (w[12] = 'Syntax error', 12), D = b.INVALID_MODIFICATION_ERR = (w[13] = 'Invalid modification', 13), P = b.NAMESPACE_ERR = (w[14] = 'Invalid namespace', 14), H = b.INVALID_ACCESS_ERR = (w[15] = 'Invalid access', 15);
    B.prototype = Error.prototype, r(b, B), j.prototype = {
        length: 0,
        item: function (e) {
            return this[e] || null;
        }
    }, F.prototype.item = function (e) {
        return I(this), this[e];
    }, i(F, j), q.prototype = {
        length: 0,
        item: j.prototype.item,
        getNamedItem: function (e) {
            var t = this.length;
            while (t--) {
                var n = this[t];
                if (n.nodeName == e)
                    return n;
            }
        },
        setNamedItem: function (e) {
            var t = e.ownerElement;
            if (t && t != this._ownerElement)
                throw new B(O);
            var n = this.getNamedItem(e.nodeName);
            return U(this._ownerElement, this, e, n), n;
        },
        setNamedItemNS: function (e) {
            var t = e.ownerElement, n;
            if (t && t != this._ownerElement)
                throw new B(O);
            return n = this.getNamedItemNS(e.namespaceURI, e.localName), U(this._ownerElement, this, e, n), n;
        },
        removeNamedItem: function (e) {
            var t = this.getNamedItem(e);
            return z(this._ownerElement, this, t), t;
        },
        removeNamedItemNS: function (e, t) {
            var n = this.getNamedItemNS(e, t);
            return z(this._ownerElement, this, n), n;
        },
        getNamedItemNS: function (e, t) {
            var n = this.length;
            while (n--) {
                var r = this[n];
                if (r.localName == t && r.namespaceURI == e)
                    return r;
            }
            return null;
        }
    }, W.prototype = {
        hasFeature: function (e, t) {
            var n = this._features[e.toLowerCase()];
            return n && (!t || t in n) ? !0 : !1;
        },
        createDocument: function (e, t, n) {
            var r = new J();
            r.implementation = this, r.childNodes = new j(), r.doctype = n, n && r.appendChild(n);
            if (t) {
                var i = r.createElementNS(e, t);
                r.appendChild(i);
            }
            return r;
        },
        createDocumentType: function (e, t, n) {
            var r = new ut();
            return r.name = e, r.nodeName = e, r.publicId = t, r.systemId = n, r;
        }
    }, X.prototype = {
        firstChild: null,
        lastChild: null,
        previousSibling: null,
        nextSibling: null,
        attributes: null,
        parentNode: null,
        childNodes: null,
        ownerDocument: null,
        nodeValue: null,
        namespaceURI: null,
        prefix: null,
        localName: null,
        insertBefore: function (e, t) {
            return Z(this, e, t);
        },
        replaceChild: function (e, t) {
            this.insertBefore(e, t), t && this.removeChild(t);
        },
        removeChild: function (e) {
            return Y(this, e);
        },
        appendChild: function (e) {
            return this.insertBefore(e, null);
        },
        hasChildNodes: function () {
            return this.firstChild != null;
        },
        cloneNode: function (e) {
            return mt(this.ownerDocument || this, this, e);
        },
        normalize: function () {
            var e = this.firstChild;
            while (e) {
                var t = e.nextSibling;
                t && t.nodeType == f && e.nodeType == f ? (this.removeChild(t), e.appendData(t.data)) : (e.normalize(), e = t);
            }
        },
        isSupported: function (e, t) {
            return this.ownerDocument.implementation.hasFeature(e, t);
        },
        hasAttributes: function () {
            return this.attributes.length > 0;
        },
        lookupPrefix: function (e) {
            var t = this;
            while (t) {
                var n = t._nsMap;
                if (n)
                    for (var r in n)
                        if (n[r] == e)
                            return r;
                t = t.nodeType == 2 ? t.ownerDocument : t.parentNode;
            }
            return null;
        },
        lookupNamespaceURI: function (e) {
            var t = this;
            while (t) {
                var n = t._nsMap;
                if (n && e in n)
                    return n[e];
                t = t.nodeType == 2 ? t.ownerDocument : t.parentNode;
            }
            return null;
        },
        isDefaultNamespace: function (e) {
            var t = this.lookupPrefix(e);
            return t == null;
        }
    }, r(o, X), r(o, X.prototype), J.prototype = {
        nodeName: '#document',
        nodeType: v,
        doctype: null,
        documentElement: null,
        _inc: 1,
        insertBefore: function (e, t) {
            if (e.nodeType == g) {
                var n = e.firstChild;
                while (n) {
                    var r = n.nextSibling;
                    this.insertBefore(n, t), n = r;
                }
                return e;
            }
            return this.documentElement == null && e.nodeType == 1 && (this.documentElement = e), Z(this, e, t), e.ownerDocument = this, e;
        },
        removeChild: function (e) {
            return this.documentElement == e && (this.documentElement = null), Y(this, e);
        },
        importNode: function (e, t) {
            return vt(this, e, t);
        },
        getElementById: function (e) {
            var t = null;
            return $(this.documentElement, function (n) {
                if (n.nodeType == 1 && n.getAttribute('id') == e)
                    return t = n, !0;
            }), t;
        },
        createElement: function (e) {
            var t = new tt();
            t.ownerDocument = this, t.nodeName = e, t.tagName = e, t.childNodes = new j();
            var n = t.attributes = new q();
            return n._ownerElement = t, t;
        },
        createDocumentFragment: function () {
            var e = new ct();
            return e.ownerDocument = this, e.childNodes = new j(), e;
        },
        createTextNode: function (e) {
            var t = new it();
            return t.ownerDocument = this, t.appendData(e), t;
        },
        createComment: function (e) {
            var t = new st();
            return t.ownerDocument = this, t.appendData(e), t;
        },
        createCDATASection: function (e) {
            var t = new ot();
            return t.ownerDocument = this, t.appendData(e), t;
        },
        createProcessingInstruction: function (e, t) {
            var n = new ht();
            return n.ownerDocument = this, n.tagName = n.target = e, n.nodeValue = n.data = t, n;
        },
        createAttribute: function (e) {
            var t = new nt();
            return t.ownerDocument = this, t.name = e, t.nodeName = e, t.localName = e, t.specified = !0, t;
        },
        createEntityReference: function (e) {
            var t = new lt();
            return t.ownerDocument = this, t.nodeName = e, t;
        },
        createElementNS: function (e, t) {
            var n = new tt(), r = t.split(':'), i = n.attributes = new q();
            return n.childNodes = new j(), n.ownerDocument = this, n.nodeName = t, n.tagName = t, n.namespaceURI = e, r.length == 2 ? (n.prefix = r[0], n.localName = r[1]) : n.localName = t, i._ownerElement = n, n;
        },
        createAttributeNS: function (e, t) {
            var n = new nt(), r = t.split(':');
            return n.ownerDocument = this, n.nodeName = t, n.name = t, n.namespaceURI = e, n.specified = !0, r.length == 2 ? (n.prefix = r[0], n.localName = r[1]) : n.localName = t, n;
        }
    }, i(J, X), tt.prototype = {
        nodeType: u,
        hasAttribute: function (e) {
            return this.getAttributeNode(e) != null;
        },
        getAttribute: function (e) {
            var t = this.getAttributeNode(e);
            return t && t.value || '';
        },
        getAttributeNode: function (e) {
            return this.attributes.getNamedItem(e);
        },
        setAttribute: function (e, t) {
            var n = this.ownerDocument.createAttribute(e);
            n.value = n.nodeValue = '' + t, this.setAttributeNode(n);
        },
        removeAttribute: function (e) {
            var t = this.getAttributeNode(e);
            t && this.removeAttributeNode(t);
        },
        appendChild: function (e) {
            return e.nodeType === g ? this.insertBefore(e, null) : et(this, e);
        },
        setAttributeNode: function (e) {
            return this.attributes.setNamedItem(e);
        },
        setAttributeNodeNS: function (e) {
            return this.attributes.setNamedItemNS(e);
        },
        removeAttributeNode: function (e) {
            return this.attributes.removeNamedItem(e.nodeName);
        },
        removeAttributeNS: function (e, t) {
            var n = this.getAttributeNodeNS(e, t);
            n && this.removeAttributeNode(n);
        },
        hasAttributeNS: function (e, t) {
            return this.getAttributeNodeNS(e, t) != null;
        },
        getAttributeNS: function (e, t) {
            var n = this.getAttributeNodeNS(e, t);
            return n && n.value || '';
        },
        setAttributeNS: function (e, t, n) {
            var r = this.ownerDocument.createAttributeNS(e, t);
            r.value = r.nodeValue = '' + n, this.setAttributeNode(r);
        },
        getAttributeNodeNS: function (e, t) {
            return this.attributes.getNamedItemNS(e, t);
        },
        getElementsByTagName: function (e) {
            return new F(this, function (t) {
                var n = [];
                return $(t, function (r) {
                    r !== t && r.nodeType == u && (e === '*' || r.tagName == e) && n.push(r);
                }), n;
            });
        },
        getElementsByTagNameNS: function (e, t) {
            return new F(this, function (n) {
                var r = [];
                return $(n, function (i) {
                    i !== n && i.nodeType === u && (e === '*' || i.namespaceURI === e) && (t === '*' || i.localName == t) && r.push(i);
                }), r;
            });
        }
    }, J.prototype.getElementsByTagName = tt.prototype.getElementsByTagName, J.prototype.getElementsByTagNameNS = tt.prototype.getElementsByTagNameNS, i(tt, X), nt.prototype.nodeType = a, i(nt, X), rt.prototype = {
        data: '',
        substringData: function (e, t) {
            return this.data.substring(e, e + t);
        },
        appendData: function (e) {
            e = this.data + e, this.nodeValue = this.data = e, this.length = e.length;
        },
        insertData: function (e, t) {
            this.replaceData(e, 0, t);
        },
        appendChild: function (e) {
            throw new Error(w[3]);
        },
        deleteData: function (e, t) {
            this.replaceData(e, t, '');
        },
        replaceData: function (e, t, n) {
            var r = this.data.substring(0, e), i = this.data.substring(e + t);
            n = r + n + i, this.nodeValue = this.data = n, this.length = n.length;
        }
    }, i(rt, X), it.prototype = {
        nodeName: '#text',
        nodeType: f,
        splitText: function (e) {
            var t = this.data, n = t.substring(e);
            t = t.substring(0, e), this.data = this.nodeValue = t, this.length = t.length;
            var r = this.ownerDocument.createTextNode(n);
            return this.parentNode && this.parentNode.insertBefore(r, this.nextSibling), r;
        }
    }, i(it, rt), st.prototype = {
        nodeName: '#comment',
        nodeType: d
    }, i(st, rt), ot.prototype = {
        nodeName: '#cdata-section',
        nodeType: l
    }, i(ot, rt), ut.prototype.nodeType = m, i(ut, X), at.prototype.nodeType = y, i(at, X), ft.prototype.nodeType = h, i(ft, X), lt.prototype.nodeType = c, i(lt, X), ct.prototype.nodeName = '#document-fragment', ct.prototype.nodeType = g, i(ct, X), ht.prototype.nodeType = p, i(ht, X), pt.prototype.serializeToString = function (e) {
        var t = [];
        return dt(e, t), t.join('');
    }, X.prototype.toString = function () {
        return pt.prototype.serializeToString(this);
    };
    try {
        if (Object.defineProperty) {
            Object.defineProperty(F.prototype, 'length', {
                get: function () {
                    return I(this), this.$$length;
                }
            }), Object.defineProperty(X.prototype, 'textContent', {
                get: function () {
                    return yt(this);
                },
                set: function (e) {
                    switch (this.nodeType) {
                    case 1:
                    case 11:
                        while (this.firstChild)
                            this.removeChild(this.firstChild);
                        (e || String(e)) && this.appendChild(this.ownerDocument.createTextNode(e));
                        break;
                    default:
                        this.data = e, this.value = value, this.nodeValue = e;
                    }
                }
            });
            function yt(e) {
                switch (e.nodeType) {
                case 1:
                case 11:
                    var t = [];
                    e = e.firstChild;
                    while (e)
                        e.nodeType !== 7 && e.nodeType !== 8 && t.push(yt(e)), e = e.nextSibling;
                    return t.join('');
                default:
                    return e.nodeValue;
                }
            }
            gt = function (e, t, n) {
                e['$$' + t] = n;
            };
        }
    } catch (bt) {
    }
    return W;
}), define('ace/mode/xml/dom-parser', [
    'require',
    'exports',
    'module',
    'ace/mode/xml/sax',
    'ace/mode/xml/dom'
], function (e, t, n) {
    'use strict';
    function s(e) {
        this.options = e || { locator: {} };
    }
    function o(e, t, n) {
        function s(t) {
            var s = e[t];
            if (!s)
                if (i)
                    s = e.length == 2 ? function (n) {
                        e(t, n);
                    } : e;
                else {
                    var o = arguments.length;
                    while (--o)
                        if (s = e[arguments[o]])
                            break;
                }
            r[t] = s && function (e) {
                s(e + f(n), e, n);
            } || function () {
            };
        }
        if (!e) {
            if (t instanceof u)
                return t;
            e = t;
        }
        var r = {}, i = e instanceof Function;
        return n = n || {}, s('warning', 'warn'), s('error', 'warn', 'warning'), s('fatalError', 'warn', 'warning', 'error'), r;
    }
    function u() {
        this.cdata = !1;
    }
    function a(e, t) {
        t.lineNumber = e.lineNumber, t.columnNumber = e.columnNumber;
    }
    function f(e) {
        if (e)
            return '\n@' + (e.systemId || '') + '#[line:' + e.lineNumber + ',col:' + e.columnNumber + ']';
    }
    function l(e, t, n) {
        return typeof e == 'string' ? e.substr(t, n) : e.length >= t + n || t ? new java.lang.String(e, t, n) + '' : e;
    }
    function c(e, t) {
        e.currentElement ? e.currentElement.appendChild(t) : e.document.appendChild(t);
    }
    var r = e('./sax'), i = e('./dom');
    return s.prototype.parseFromString = function (e, t) {
        var n = this.options, i = new r(), s = n.domBuilder || new u(), a = n.errorHandler, f = n.locator, l = n.xmlns || {}, c = {
                lt: '<',
                gt: '>',
                amp: '&',
                quot: '"',
                apos: '\''
            };
        return f && s.setDocumentLocator(f), i.errorHandler = o(a, s, f), i.domBuilder = n.domBuilder || s, /\/x?html?$/.test(t) && (c.nbsp = '\xA0', c.copy = '\xA9', l[''] = 'http://www.w3.org/1999/xhtml'), e ? i.parse(e, l, c) : i.errorHandler.error('invalid document source'), s.document;
    }, u.prototype = {
        startDocument: function () {
            this.document = new i().createDocument(null, null, null), this.locator && (this.document.documentURI = this.locator.systemId);
        },
        startElement: function (e, t, n, r) {
            var i = this.document, s = i.createElementNS(e, n || t), o = r.length;
            c(this, s), this.currentElement = s, this.locator && a(this.locator, s);
            for (var u = 0; u < o; u++) {
                var e = r.getURI(u), f = r.getValue(u), n = r.getQName(u), l = i.createAttributeNS(e, n);
                l.getOffset && a(l.getOffset(1), l), l.value = l.nodeValue = f, s.setAttributeNode(l);
            }
        },
        endElement: function (e, t, n) {
            var r = this.currentElement, i = r.tagName;
            this.currentElement = r.parentNode;
        },
        startPrefixMapping: function (e, t) {
        },
        endPrefixMapping: function (e) {
        },
        processingInstruction: function (e, t) {
            var n = this.document.createProcessingInstruction(e, t);
            this.locator && a(this.locator, n), c(this, n);
        },
        ignorableWhitespace: function (e, t, n) {
        },
        characters: function (e, t, n) {
            e = l.apply(this, arguments);
            if (this.currentElement && e) {
                if (this.cdata) {
                    var r = this.document.createCDATASection(e);
                    this.currentElement.appendChild(r);
                } else {
                    var r = this.document.createTextNode(e);
                    this.currentElement.appendChild(r);
                }
                this.locator && a(this.locator, r);
            }
        },
        skippedEntity: function (e) {
        },
        endDocument: function () {
            this.document.normalize();
        },
        setDocumentLocator: function (e) {
            if (this.locator = e)
                e.lineNumber = 0;
        },
        comment: function (e, t, n) {
            e = l.apply(this, arguments);
            var r = this.document.createComment(e);
            this.locator && a(this.locator, r), c(this, r);
        },
        startCDATA: function () {
            this.cdata = !0;
        },
        endCDATA: function () {
            this.cdata = !1;
        },
        startDTD: function (e, t, n) {
            var r = this.document.implementation;
            if (r && r.createDocumentType) {
                var i = r.createDocumentType(e, t, n);
                this.locator && a(this.locator, i), c(this, i);
            }
        },
        warning: function (e) {
            console.warn(e, f(this.locator));
        },
        error: function (e) {
            console.error(e, f(this.locator));
        },
        fatalError: function (e) {
            throw console.error(e, f(this.locator)), e;
        }
    }, 'endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl'.replace(/\w+/g, function (e) {
        u.prototype[e] = function () {
            return null;
        };
    }), { DOMParser: s };
}), define('ace/mode/xml_worker', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/lib/lang',
    'ace/worker/mirror',
    'ace/mode/xml/dom-parser'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('../lib/lang'), s = e('../worker/mirror').Mirror, o = e('./xml/dom-parser').DOMParser, u = t.Worker = function (e) {
            s.call(this, e), this.setTimeout(400), this.context = null;
        };
    r.inherits(u, s), function () {
        this.setOptions = function (e) {
            this.context = e.context;
        }, this.onUpdate = function () {
            var e = this.doc.getValue();
            if (!e)
                return;
            var t = new o(), n = [];
            t.options.errorHandler = {
                fatalError: function (e, t, r) {
                    n.push({
                        row: r.lineNumber,
                        column: r.columnNumber,
                        text: t,
                        type: 'error'
                    });
                },
                error: function (e, t, r) {
                    n.push({
                        row: r.lineNumber,
                        column: r.columnNumber,
                        text: t,
                        type: 'error'
                    });
                },
                warning: function (e, t, r) {
                    n.push({
                        row: r.lineNumber,
                        column: r.columnNumber,
                        text: t,
                        type: 'warning'
                    });
                }
            }, t.parseFromString(e), this.sender.emit('error', n);
        };
    }.call(u.prototype);
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