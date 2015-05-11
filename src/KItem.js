/**
 * @file KItem.js
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    require('k-component/component!k-component-element/k-item');

    /**
     * KItem.js
     * @class
     */
    var overrides = {
        /**
         * 属性监听配置
         * - key 为要监听的属性名
         * - value 为处理函数：{function(newVal:string, oldVal:string)}
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

    var KItem = require('eoo').create(require('k-component/Action'), overrides);

    return KItem;
});
