define('k-component-element/MarkSelectable', [
    'require',
    'k-component/k',
    'k-component/component!k-component-element/mark-selectable',
    'eoo',
    './MarkAction'
], function (require) {
    var $k = require('k-component/k');
    require('k-component/component!k-component-element/mark-selectable');
    var overrides = {
            initialize: function () {
                this.$super(arguments);
                var el = $k.$(this.el);
                this.selection = el.attr('selection');
                this.multi = el.attr('multi') != null;
                this.disabled = el.attr('disabled') != null;
                this.host.selection = this;
            },
            bindEvents: function () {
                var me = this;
                $k.$(me.host).on('click', me.selection, function (e) {
                    if (e.target !== me.host) {
                        me.select(e.target);
                    }
                });
            },
            select: function (target) {
                var me = this;
                target = $k.$(target);
                if (!me.disabled) {
                    if (me.multi) {
                        target.toggleClass('selected');
                        $k.$(me.host).trigger('select');
                    } else if (!target.hasClass('selected')) {
                        $k.$(me.getSelected()).removeClass('selected');
                        target.addClass('selected');
                        $k.$(me.host).trigger('select');
                    }
                }
            },
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
            dispose: function () {
                this.$super(arguments);
            }
        };
    var MarkSelectable = require('eoo').create(require('./MarkAction'), overrides);
    return MarkSelectable;
});