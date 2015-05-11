define('k-component/lib/util', [
    'require',
    'lodash',
    'mini-event/Event'
], function (require) {
    var _ = require('lodash');
    var util = {
            isXML: function (doc) {
                return doc.createElement('p').nodeName !== doc.createElement('P').nodeName;
            },
            contains: function (a, b, same) {
                if (a === b) {
                    return !!same;
                }
                if (!b.parentNode) {
                    return false;
                }
                if (a.contains) {
                    return a.contains(b);
                } else if (a.compareDocumentPosition) {
                    return !!(a.compareDocumentPosition(b) & 16);
                }
                while (b = b.parentNode) {
                    if (a === b) {
                        return true;
                    }
                }
                return false;
            }
        };
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
    util.processError = function (ex) {
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
    };
    return util;
});