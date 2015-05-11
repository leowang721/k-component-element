/**
 * @file KSelection.js
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    require('./MarkSelectable');
    require('k-component/component!k-component-element/k-selection');

    /**
     * KSelection.js，没有样式，需自行定义 k-selection 和 [selected]
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
            var el = this.$(this.el);
            this.$('mark-selectable')
                .attr('multi', el.attr('multi'))
                .attr('disabled', el.attr('disabled'));
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
                this.el.selection.select(element);
            }
        },

        /**
         * 销毁处理
         */
        dispose: function () {
            this.$super(arguments);
        }
    };

    var KSelection = require('fc-core/oo').derive(require('k-component/Action'), overrides);

    return KSelection;
});
