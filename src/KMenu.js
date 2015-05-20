/**
 * @file KMenu.js
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    require('k-component/component!k-component-element/k-menu');
    require('./KItem');

    /**
     * KMenu.js
     * @class
     */
    var overrides = {

        /**
         * 初始化，可用于调整 DOM 结构
         */
        initialize: function () {},

        /**
         * 事件绑定处理，直接使用 DOM 行为即可
         */
        bindEvents: function () {
            var me = this;
            var el = me.$(me.el);
            var content = me.$(me.content);

            content.children().on('open', function () {
                content.children().filter('k-submenu[actived]').attr('actived', null);
            });
        },

        /**
         * 属性监听配置
         * - key 为要监听的属性名
         * - value 为处理函数：{function(oldVal:string, newVal:string)}
         *
         * @type {Object}
         */
        attributes: {},

        /**
         * 销毁处理
         */
        dispose: function () {
            this.$super(arguments);
        }
    };

    var KMenu = require('fc-core/oo').derive(require('k-component/Action'), overrides);

    return KMenu;
});
