/**
 * @file 在一个 component 中使用，使之支持 data-command 模式
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    var _ = require('lodash');
    var $k = require('k-component/k');

    require('k-component/component!k-component-element/mark-commandable');

    /**
     * 在一个 component 中使用，使之支持 data-command 模式
     * @class
     */
    var overrides = {

        supportedEvent: ['click', 'mousedown', 'mouseup'],

        /**
         * 初始化，可用于调整 DOM 结构
         */
        initialize: function () {

            this.$super(arguments);

            this.type = this.$(this.el).attr('event-type');
            // 只支持配置好的事件类型
            if (_.indexOf(this.supportedEvent, this.type) === -1) {
                this.type = 'click';
            }
        },

        /**
         * 事件绑定处理，直接使用 DOM 行为即可
         */
        bindEvents: function () {
            this.$host.on(this.type, _.bind(this.executeCommand, this));
        },

        /**
         * 属性监听配置
         * - key 为要监听的属性名
         * - value 为处理函数：{function(oldVal:string, newVal:string)}
         *
         * @type {Object}
         */
        attributes: {},

        executeCommand: function (e) {
            var target = this.$(e.target);
            var type = target.attr('data-command');
            var args = target.attr('data-command-args');

            if (type == null) {
                return;
            }

            try {
                args = JSON.parse(args);
            }
            catch (e) {}

            this.$host.trigger('command', {
                type: type,
                args: args
            });
            this.$host.trigger('command:' + type, args);

            e.preventDefault();
            // e.stopPropagation();
        },

        /**
         * 销毁处理
         */
        dispose: function () {
            this.$host.off(this.type, '[data-command]', _.bind(this.executeCommand, this));
            this.$super(arguments);
        }
    };

    var KCommand = require('fc-core/oo').derive(require('./MarkAction'), overrides);

    return KCommand;
});
