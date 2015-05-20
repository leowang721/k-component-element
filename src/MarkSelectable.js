/**
 * @file MarkSelectable.js
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    require('k-component/component!k-component-element/mark-selectable');

    /**
     * 标记后面的兄弟元素为selectable的
     * @class
     */
    var overrides = {

        /**
         * 初始化，可用于调整 DOM 结构
         */
        initialize: function () {
            this.$super(arguments);

            this.selection = this.el.attr('selection') || '*';
            this.multi = this.el.attr('multi') != null;
            this.disabled = this.el.attr('disabled') != null;

            this.host[0].selection = this;
            this.$(this.getSelected()).addClass('selected');
        },

        /**
         * 事件绑定处理，直接使用 DOM 行为即可
         */
        bindEvents: function () {
            var me = this;
            me.$host.on('mousedown', me.selection, function (e) {
                if (e.target !== me.host) {
                    me.select(e.target);
                }
            });
        },

        /**
         * 选择/反选一个元素
         *
         * @param { HTMLElement} target 要选择/反选的元素
         */
        select: function (target) {
            var me = this;
            target = me.$(target);

            if (me.disabled) {
                return;
            }
            if (me.multi) {
                if (target.attr('selected') != null) {
                    target.attr('selected', null).removeClass('selected');
                }
                else {
                    target.attr('selected', '').addClass('selected');
                }
                me.$(me.host).trigger('select');
            }
            else if (target.attr('selected') == null) {
                me.$(me.getSelected()).attr('selected', null).removeClass('selected');
                target.attr('selected', '').addClass('selected');
                me.$(me.host).trigger('select');
            }
        },

        /**
         * 属性监听配置
         * - key 为要监听的属性名
         * - value 为处理函数：{function(newVal:string, oldVal:string)}
         *
         * @type {Object}
         */
        attributes: {
            'multi': function (newVal) {
                this.set('multi', newVal != null);
            },
            'disabled': function (newVal) {
                this.set('disabled', newVal != null);
            }
        },

        getSelection: function () {
            return this.$(this.host).find(this.selection);
        },

        getSelected: function () {
            var result = this.getSelection().filter('[selected]');
            return this.multi ? result : result[0];
        },

        /**
         * 销毁处理
         */
        dispose: function () {
            this.$super(arguments);
        }
    };

    var MarkSelectable = require('eoo').create(require('./MarkAction'), overrides);

    return MarkSelectable;
});
