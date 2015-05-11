define('k-component-element/MarkCommandable', [
    'require',
    'lodash',
    'k-component/k',
    'k-component/component!k-component-element/mark-commandable',
    'fc-core/oo',
    './MarkAction'
], function (require) {
    var _ = require('lodash');
    var $k = require('k-component/k');
    require('k-component/component!k-component-element/mark-commandable');
    var overrides = {
            supportedEvent: [
                'click',
                'mousedown',
                'mouseup'
            ],
            initialize: function () {
                this.$super(arguments);
                this.type = $k.$(this.el).attr('event-type');
                if (_.indexOf(this.supportedEvent, this.type) === -1) {
                    this.type = 'click';
                }
            },
            bindEvents: function () {
                $k.$(this.host).on(this.type, '[data-command]', _.bind(this.executeCommand, this));
            },
            attributes: {},
            executeCommand: function (e) {
                var target = $k.$(e.target);
                var type = target.attr('data-command');
                var args = target.attr('data-command-args');
                try {
                    args = JSON.parse(args);
                } catch (e) {
                }
                $k.$(this.host).trigger('command', {
                    type: type,
                    args: args
                });
                $k.$(this.host).trigger('command:' + type, args);
                e.preventDefault();
                e.stopPropagation();
            },
            dispose: function () {
                $k.$(this.host).off(this.type, '[data-command]', _.bind(this.executeCommand, this));
                this.$super(arguments);
            }
        };
    var KCommand = require('fc-core/oo').derive(require('./MarkAction'), overrides);
    return KCommand;
});