/**
 * @file KScroll.js
 *
 * @author Ming Liu(liuming07@baidu.com)
 */

define(function (require) {

    require('k-component/component!k-component-element/k-scrolll');

    /**
     * KScroll.js
     * @class
     */
    var overrides = {

        /**
         * 初始化，可用于调整 DOM 结构
         */
        initialize: function () {
        },

        /**
         * 初始化行为，例如 model 的初始化、自身实例事件处理等
         */
        initBehavior: function () {
            this.$('mark-selectable')
                .attr('multi', this.el.attr('multi'))
                .attr('disabled', this.el.attr('disabled'));
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
                this.$('mark-selectable').attr('multi', newVal);
            },
            'disabled': function (newVal) {
                this.$('mark-selectable').attr('disabled', newVal);
            }
        },

        /**
         * 选择一个元素 item
         *
         * @param {HTMLElement} element  要选择的元素
         *
         */
        select: function (element) {
            if (element) {
                this.el[0].selection.select(element);
            }
        },

        /**
         * 销毁处理
         */
        dispose: function () {
            this.$super(arguments);
        }
    };

    var KScroll = require('fc-core/oo').derive(require('k-component/Action'), overrides);

    return KScroll;
});
