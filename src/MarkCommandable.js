/**
 * @file 在一个 component 中使用，使之支持 data-command 模式
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    var _ = require('lodash');

    require('k-component/component!k-component-element/mark-commandable');

    /**
     * 在一个 component 中使用，使之支持 data-command 模式
     * @class
     */
    var overrides = {

        supportedEvent: ['click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'],

        /**
         * 初始化，可用于调整 DOM 结构
         */
        initialize: function () {

            this.$super(arguments);

            this.type = _.trim(this.el.attr('event-type')) || 'mousedown';
            this.handler = _.bind(this.executeCommand, this);
        },

        /**
         * 事件绑定处理，直接使用 DOM 行为即可
         */
        bindEvents: function () {
            var me = this;

            // 只支持配置好的事件类型
            if (_.indexOf(me.supportedEvent, me.type) !== -1) {
                me.$host.on(me.type, me.handler);
            }
        },

        /**
         * 解绑事件
         */
        unbindEvents: function () {
            var me = this;
            me.$host.off(me.type, me.handler);
        },

        /**
         * 属性监听配置
         * - key 为要监听的属性名
         * - value 为处理函数：{function(oldVal:string, newVal:string)}
         *
         * @type {Object}
         */
        attributes: {
            'event-type': function (newVal) {
                var me = this;
                me.unbindEvents();
                me.type = _.trim(newVal) || 'mousedown';
                me.bindEvents();
            }
        },

        executeCommand: function (e) {
            var target = this.$(e.target);
            var command = target.attr('data-command');
            var args = target.attr('data-command-args');
            var trigger = target.attr('data-command-trigger');

            if (command == null && (trigger && _.trim(trigger) !== this.type)) {
                return;
            }

            try {
                args = JSON.parse(args);
            }
            catch (e) {}

            this.host.trigger('command', {
                command: command,
                args: args
            });
            this.host.triggerHandler('command:' + command, args);

            e.preventDefault();
            // e.stopPropagation();
        },

        /**
         * 销毁处理
         */
        dispose: function () {
            var me = this;
            me.unbindEvents();
            this.$super(arguments);
        }
    };

    var KCommand = require('fc-core/oo').derive(require('./MarkAction'), overrides);

    return KCommand;
});
