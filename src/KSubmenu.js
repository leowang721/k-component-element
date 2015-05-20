/**
 * @file KSubmenu.js
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    var _ = require('lodash');

    require('./MarkCommandable');
    require('./KSelection');
    require('./KItem');

    require('k-component/component!./k-submenu');

    // TODO:
    // 1. 增加动画效果
    // 2. 多个submenu的单展开
    // 3. 样式的内嵌化，如果解决当前的.shadow 和 Normal样式并存的问题，这会导致以后的升级不便（可以考虑默认提供个 less 类？？）

    /**
     * KSubmenu.js
     * @class
     */
    var overrides = {

        /**
         * 初始化，可用于调整 DOM 结构
         */
        initialize: function () {
            this.label = this.el.attr('label');
            this.trigger = this.el.attr('trigger') || 'mousedown';
            if (this.label) {
                this.$('.label').html(this.label);
            }
            this.$('mark-commandable').attr('event-type', this.trigger);
        },

        /**
         * 初始化行为，例如 model 的初始化、自身实例事件处理等
         */
        initBehavior: function () {},

        /**
         * 事件绑定处理，直接使用 DOM 行为即可
         */
        bindEvents: function () {
            var me = this;
            var list = me.$('.list');
            me.el.on('command:toggle-list', function () {
                var isHidden = list.attr('hidden');
                // 先 trigger 事件
                me.el.trigger(isHidden ? 'open' : 'hide');
                me.el.attr('actived', isHidden ? '' : null);
            });
        },

        /**
         * 属性监听配置
         * - key 为要监听的属性名
         * - value 为处理函数：{function(newVal:string, oldVal:string)}
         *
         * @type {Object}
         */
        attributes: {
            'actived': function (newVal) {
                var list = this.$('.list');
                if (newVal != null) {
                    list.attr('hidden', null);
                }
                else {
                    list.attr('hidden', '');
                }
            }
        },

        /**
         * 销毁处理
         */
        dispose: function () {
            this.$super(arguments);
        }
    };

    var KSubmenu = require('eoo').create(require('k-component/Action'), overrides);

    return KSubmenu;
});
