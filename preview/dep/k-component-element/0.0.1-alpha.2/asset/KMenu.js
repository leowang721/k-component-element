define('k-component-element/KMenu', [
    'require',
    'k-component/component!./k-menu',
    './KItem',
    'fc-core/oo',
    'k-component/Action'
], function (require) {
    require('k-component/component!./k-menu');
    require('./KItem');
    var overrides = {
            initialize: function () {
            },
            bindEvents: function () {
            },
            attributes: {},
            dispose: function () {
                this.$super(arguments);
            }
        };
    var KMenu = require('fc-core/oo').derive(require('k-component/Action'), overrides);
    return KMenu;
});