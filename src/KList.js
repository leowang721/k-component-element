/**
 * @file KList.js
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    require('k-component/component!k-component-element/k-list');

    /**
     * KList.js
     * @class
     */
    var overrides = {

        /**
         * 初始化，可用于调整 DOM 结构
         */
        initialize: function () {
            // 自动生成 renderer
            this.content.html([
                '<!-- for: ${list} as ${item}, ${index} -->',
                this.content.html(),
                '<!-- /for -->'
            ].join('\n'));
        },

        /**
         * 事件绑定处理，直接使用 DOM 行为即可
         */
        bindEvents: function () {
            var me = this;
            me.data.on('change:list', me.render, me);
        },

        /**
         * 属性监听配置
         * - key 为要监听的属性名
         * - value 为处理函数：{function(oldVal:string, newVal:string)}
         *
         * @type {Object}
         */
        attributes: {},

        setList: function (list) {
            // this.model.set('list', list);
            this.data.set('list', list);
        },

        getList: function () {
            // return this.model.get('list');
            return this.data.get('list');
        },

        /**
         * 销毁处理
         */
        dispose: function () {
            this.$super(arguments);
        }
    };

    var KList = require('fc-core/oo').derive(require('k-component/Action'), overrides);

    return KList;
});
