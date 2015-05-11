define('fc-core/aop', ['require'], function (require) {
    'use strict';
    var aop = {};
    aop.before = function (context, methodName, aspectMethod) {
        if (!aspectMethod) {
            return;
        }
        var original = context[methodName];
        context[methodName] = function () {
            try {
                aspectMethod.apply(this, arguments);
            } finally {
                return original.apply(this, arguments);
            }
        };
    };
    aop.beforeReject = function (context, methodName, aspectMethod) {
        if (!aspectMethod) {
            return;
        }
        var original = context[methodName];
        context[methodName] = function () {
            if (aspectMethod.apply(this, arguments)) {
                return original.apply(this, arguments);
            }
        };
    };
    aop.after = function (context, methodName, aspectMethod) {
        if (!aspectMethod) {
            return;
        }
        var original = context[methodName];
        context[methodName] = function () {
            var result = original.apply(this, arguments);
            try {
                aspectMethod.apply(this, arguments);
            } finally {
                return result;
            }
        };
    };
    aop.around = function (context, methodName, beforeMethod, afterMethod) {
        aop.before(context, methodName, beforeMethod);
        aop.after(context, methodName, afterMethod);
    };
    return aop;
});