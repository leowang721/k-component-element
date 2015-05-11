define('k-component-element/KItem', [
    'require',
    'k-component/component!./k-item',
    'eoo',
    'k-component/Action'
], function (require) {
    require('k-component/component!./k-item');
    var overrides = {
            attributes: {},
            dispose: function () {
                this.$super(arguments);
            }
        };
    var KItem = require('eoo').create(require('k-component/Action'), overrides);
    return KItem;
});