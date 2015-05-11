define('fc-core/oo', [
    'require',
    'underscore',
    './assert',
    'eoo'
], function (require) {
    'use strict';
    var _ = require('underscore');
    var assert = require('./assert');
    var oo = require('eoo');
    var exports = {};
    exports.create = function (overrides) {
        return oo.create(overrides);
    };
    exports.derive = function (superClass, overrides) {
        assert.has(superClass, 'fc.oo.derive\u4F7F\u7528\u65F6\u5FC5\u987B\u6307\u5B9A`superClass`\u53C2\u6570\uFF01');
        assert.equals(_.isObject(overrides) || overrides === undefined, true, '\u9519\u8BEF\u7684fc.oo.derive\u53C2\u6570\uFF0C\u4F20\u5165\u7684`overrides`\u5FC5\u987B\u662F\u4E00\u4E2AObject');
        return oo.create(superClass, overrides);
    };
    return exports;
});