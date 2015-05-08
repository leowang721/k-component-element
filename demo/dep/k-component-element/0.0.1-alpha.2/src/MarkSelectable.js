/**
 * @file MarkSelectable.js
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    var $k = require('k-component/k');

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

            var el = $k.$(this.el);
            this.selection = el.attr('selection');
            this.multi = el.attr('multi') != null;
            this.disabled = el.attr('disabled') != null;

            this.host.selection = this;
        },

        /**
         * 事件绑定处理，直接使用 DOM 行为即可
         */
        bindEvents: function () {
            var me = this;
            $k.$(me.host).on('click', me.selection, function (e) {
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
            target = $k.$(target);
            if (!me.disabled) {
                if (me.multi) {
                    target.toggleClass('selected');
                    $k.$(me.host).trigger('select');
                }
                else if (!target.hasClass('selected')) {
                    $k.$(me.getSelected()).removeClass('selected');
                    target.addClass('selected');
                    $k.$(me.host).trigger('select');
                }
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
            return $k.$(this.host).find(this.selection);
        },

        getSelected: function () {
            var result = this.getSelection().filter('.selected');
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
