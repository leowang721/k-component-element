void function (define) {
    define('promise/setImmediate', [
        'require',
        './util'
    ], function (require) {
        var global = function () {
                return this;
            }();
        var callbackPool = {};
        var cursor = 1;
        function registerCallback(callback) {
            callbackPool[cursor] = callback;
            return cursor++;
        }
        function runCallback(tick) {
            var callback = callbackPool[tick];
            if (callback) {
                delete callbackPool[tick];
                callback();
            }
        }
        if (typeof global.setImmediate === 'function') {
            return require('./util').bind(global.setImmediate, global);
        }
        if (typeof global.nextTick === 'function') {
            return global.nextTick;
        }
        if (global.MutationObserver || global.webKitMutationObserver) {
            var ATTRIBUTE_NAME = 'data-promise-tick';
            var MutationObserver = global.MutationObserver || global.webKitMutationObserver;
            var ensureElementMutation = function (mutations, observer) {
                var item = mutations[0];
                if (item.attributeName === ATTRIBUTE_NAME) {
                    var tick = item.target.getAttribute(ATTRIBUTE_NAME);
                    runCallback(tick);
                    observer.disconnect(item.target);
                }
            };
            return function (callback) {
                var element = document.createElement('div');
                var observer = new MutationObserver(ensureElementMutation);
                observer.observe(element, { attributes: true });
                var tick = registerCallback(callback);
                element.setAttribute(ATTRIBUTE_NAME, tick);
            };
        }
        if (typeof postMessage === 'function' && typeof global.importScript !== 'function') {
            var isPostMessageAsync = true;
            var oldListener = global.onmessage;
            global.onmessage = function () {
                isPostMessageAsync = false;
            };
            global.postMessage('', '*');
            global.onmessage = oldListener;
            if (isPostMessageAsync) {
                var MESSAGE_PREFIX = 'promise-tick-';
                var ensureMessage = function (e) {
                    if (e.source === global && typeof e.data === 'string' && e.data.indexOf(MESSAGE_PREFIX) === 0) {
                        var tick = e.data.substring(MESSAGE_PREFIX.length);
                        runCallback(tick);
                    }
                };
                if (global.addEventListener) {
                    global.addEventListener('message', ensureMessage, false);
                } else {
                    global.attachEvent('onmessage', ensureMessage);
                }
                return function (callback) {
                    var tick = registerCallback(callback);
                    global.postMessage(MESSAGE_PREFIX + tick, '*');
                };
            }
        }
        if (global.MessageChannel) {
            var channel = new MessageChannel();
            channel.port1.onmessage = function (e) {
                var tick = e.data;
                runCallback(tick);
            };
            return function (callback) {
                var tick = registerCallback(callback);
                channel.port2.postMessage(tick);
            };
        }
        if ('onreadystatechange' in document.createElement('script')) {
            var documentElement = document.documentElement;
            return function (callback) {
                var script = document.createElement('script');
                script.onreadystatechange = function () {
                    callback();
                    script.onreadystatechange = null;
                    documentElement.removeChild(script);
                    script = null;
                };
                documentElement.appendChild(script);
            };
        }
        return function (callback) {
            setTimeout(callback, 0);
        };
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
}, this);