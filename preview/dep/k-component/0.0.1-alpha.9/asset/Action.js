define('k-component/Action', [
    'require',
    'lodash',
    './k',
    './lib/util',
    'mini-event/EventTarget',
    'eoo',
    'promise',
    './cache',
    'emc/Model',
    'etpl'
], function (require) {
    var _ = require('lodash');
    var $k = require('./k');
    var util = require('./lib/util');
    var EventTarget = require('mini-event/EventTarget');
    var eoo = require('eoo');
    var Promise = require('promise');
    var cache = require('./cache');
    var Model = require('emc/Model');
    var overrides = {
            $: function (query) {
                return $k.$(query, this.el);
            },
            constructor: function (opts) {
                var me = this;
                opts = opts || {};
                me.el = opts.el;
                me.el['k-component'] = true;
                me.content = opts.el.content;
                me.shadowRoot = opts.el.shadowRoot;
                me.data = cache.curry(me.el);
                me.el.setAttribute('data-guid', util.guid());
                me.initialize();
                var html = me.content.innerHTML;
                me.renderer = require('etpl').compile(html);
                me.createModel();
                this.promise = new Promise(function (resolve, reject) {
                    me.initBehavior();
                    me.bindEvents();
                    resolve();
                });
            },
            initialize: _.noop,
            createModel: function () {
                this.model = new Model();
                return this.model;
            },
            getModel: function () {
                return this.model.dump();
            },
            render: function () {
                this.content.innerHTML = this.renderer(this.getModel());
            },
            ready: function (method) {
                this.promise.then(_.bind(method, this));
            },
            attributes: {},
            getAttributes: function () {
                return this.attributes || {};
            },
            setAttributes: function (newAttr) {
                this.attributes = newAttr;
            },
            attributeChangedCallback: function (attrName, oldVal, newVal) {
                var attributes = this.getAttributes();
                if (attributes && 'function' === typeof attributes[attrName] && oldVal !== newVal) {
                    attributes[attrName].call(this, newVal, oldVal);
                }
                if (/^data\-/.test(attrName) && oldVal !== newVal) {
                    var key = _.camelCase(attrName.replace(/^data\-/g, ''));
                    this.model.set(key, newVal);
                }
            },
            initBehavior: _.noop,
            bindEvents: _.noop,
            getParent: function () {
                var p = this.el;
                while (p !== document.body) {
                    p = p.parentNode || p.host;
                    if (!p) {
                        return;
                    }
                    if (p['k-component']) {
                        return $k.get(p);
                    }
                }
            },
            processError: function (e) {
                util.processError(e);
            },
            get: function (propName) {
                return this[propName];
            },
            set: function (propName, newVal) {
                this[propName] = newVal;
            },
            dispose: function () {
                this.data = null;
                this.destroyEvents();
            }
        };
    var Action = eoo.create(EventTarget, overrides);
    return Action;
});