define('k-component-element/KSelection', [
    'require',
    'k-component/k',
    './MarkSelectable',
    'k-component/component!k-component-element/k-selection',
    'fc-core/oo',
    'k-component/Action'
], function (require) {
    var $k = require('k-component/k');
    require('./MarkSelectable');
    require('k-component/component!k-component-element/k-selection');
    var overrides = {
            initialize: function () {
            },
            initBehavior: function () {
                var el = $k.$(this.el);
                this.$('mark-selectable').attr('multi', el.attr('multi')).attr('disabled', el.attr('disabled'));
            },
            attributes: {
                'multi': function (newVal) {
                    this.$('mark-selectable').attr('multi', newVal);
                },
                'disabled': function (newVal) {
                    this.$('mark-selectable').attr('disabled', newVal);
                }
            },
            select: function (element) {
                if (element) {
                    this.el.selection.select(element);
                }
            },
            dispose: function () {
                this.$super(arguments);
            }
        };
    var KSelection = require('fc-core/oo').derive(require('k-component/Action'), overrides);
    return KSelection;
});