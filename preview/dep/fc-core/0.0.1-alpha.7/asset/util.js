define('fc-core/util', [
    'require',
    'underscore',
    'mini-event/Event',
    'etpl'
], function (require) {
    'use strict';
    var _ = require('underscore');
    var util = {};
    function rand16Num(len) {
        len = len || 0;
        var result = [];
        for (var i = 0; i < len; i++) {
            result.push('0123456789abcdef'.charAt(Math.floor(Math.random() * 16)));
        }
        return result.join('');
    }
    util.guid = function () {
        var curr = new Date().valueOf().toString();
        return [
            '4b534c46',
            rand16Num(4),
            '4' + rand16Num(3),
            rand16Num(4),
            curr.substring(0, 12)
        ].join('-');
    };
    util.uid = function () {
        return [
            new Date().valueOf().toString(),
            rand16Num(4)
        ].join('');
    };
    var search = window.location.search.substring(1);
    util.processError = window.DEBUG || /\bdebug\b/g.test(search) ? function (ex) {
        if (ex instanceof Error) {
            window.console.error(ex.stack);
        } else if (ex.error instanceof Error || _.isArray(ex.error)) {
            util.processError(ex.error);
        } else if (_.isArray(ex)) {
            _.each(ex, util.processError);
        } else if (ex instanceof require('mini-event/Event') && ex.type === 'error') {
            window.console.error(ex.error.failType, ex.error.reason, ex);
        } else {
            window.console.error(ex);
        }
    } : _.noop;
    function mixWith(conf, data) {
        return JSON.parse(require('etpl').compile(JSON.stringify(conf))(data));
    }
    util.mixWith = mixWith;
    util.customData = function (data) {
        return { data: data };
    };
    return util;
});