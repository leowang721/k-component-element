define('k-component/registry', [
    'require',
    'lodash',
    './cache',
    'custom-element-shim',
    './config',
    'etpl',
    'promise'
], function (require) {
    var _ = require('lodash');
    var cache = require('./cache');
    require('custom-element-shim');
    var config = require('./config');
    var etpl = require('etpl');
    var Promise = require('promise');
    var registerTagPrototype = {};
    var isSupportShadowDOM = !!document.body.createShadowRoot;
    var getK = function (el) {
        return cache._data(el, config.CACHED_ACTION_KEY);
    };
    registerTagPrototype.createdCallback = function () {
        var tagName = this.getAttribute('name');
        var template = this.querySelector('template');
        var actionPath = this.getAttribute('action');
        register(tagName, {
            template: template,
            actionPath: actionPath,
            createdCallback: function () {
                this.setAttribute('k-component', true);
                var me = this;
                processShadowRoot(me);
                me.promise = new Promise(function (resolve, reject) {
                    if (me.actionPath) {
                        Promise.require([me.actionPath]).then(function (Action) {
                            if (_.isArray(Action)) {
                                Action = Action[0];
                            }
                            var action = new Action({ el: me });
                            cache._data(me, config.CACHED_ACTION_KEY, action);
                            action.ready(function () {
                                resolve();
                            });
                        }).catch(reject);
                    } else {
                        resolve();
                    }
                });
            },
            attachedCallback: function () {
                var me = this;
            },
            detachedCallback: function () {
                var me = this;
                me.promise && me.promise.then(function () {
                    getK(me) && getK(me).dispose();
                });
            },
            attributeChangedCallback: function (attrName, oldVal, newVal) {
                var me = this;
                me.promise && me.promise.then(function () {
                    getK(me) && getK(me).attributeChangedCallback(attrName, oldVal, newVal);
                });
            }
        });
    };
    function processShadowRoot(me) {
        var template = me.template;
        if (me.componentInited) {
            return;
        }
        if (isSupportShadowDOM) {
            var shadow = me.createShadowRoot();
            var clone = document.importNode(template.content, true);
            shadow.appendChild(clone);
            var content = shadow.querySelector('content');
            if (!content) {
                content = document.createElement('content');
                shadow.appendChild(content);
            }
            me.content = me;
        } else {
            var fakeShadowRoot = document.createElement('fake-shadow-root');
            fakeShadowRoot.innerHTML = template.innerHTML;
            me.shadowRoot = fakeShadowRoot;
            me.appendChild(fakeShadowRoot);
            var content = fakeShadowRoot.querySelector('content');
            if (!content) {
                content = document.createElement('content');
                fakeShadowRoot.appendChild(content);
            }
            me.content = content;
            for (var i = me.childNodes.length - 1; i >= 0; i--) {
                if (me.childNodes[i].nodeType === 1 && me.childNodes[i].tagName.toLowerCase() === 'fake-shadow-root') {
                    continue;
                }
                if (content.childNodes.length === 0) {
                    content.appendChild(me.childNodes[i]);
                } else {
                    content.insertBefore(me.childNodes[i], content.firstChild);
                }
            }
        }
        me.componentInited = true;
    }
    registerTagPrototype.attachedCallback = function () {
    };
    register(config.REGISTER_TAG, registerTagPrototype);
    function register(name, protoExt) {
        document.registerElement(name, { prototype: _.extend(Object.create(HTMLElement.prototype), protoExt || {}) });
    }
    var registry = {
            registerFromHTML: function (html) {
                var container;
                container = getRegisterContaienr();
                container.innerHTML = html;
            }
        };
    function getRegisterContaienr() {
        var id = '$$$__register_temp_container__$$$';
        var container = document.getElementById(id);
        if (container) {
            return container;
        }
        container = document.createElement('div');
        container.id = id;
        container.style.width = 0;
        container.style.height = 0;
        container.style.overflow = 'hidden';
        document.body.appendChild(container);
        return container;
    }
    return registry;
});