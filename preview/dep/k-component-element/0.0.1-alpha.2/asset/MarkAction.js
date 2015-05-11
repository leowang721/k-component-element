define('k-component-element/MarkAction', [
    'require',
    'eoo',
    'k-component/Action'
], function (require) {
    var overrides = {
            initialize: function () {
                var parent = this.el.parentNode;
                if (parent.tagName && parent.tagName.toLowerCase() === 'content') {
                    parent = parent.parentNode;
                }
                if (parent.host) {
                    parent = parent.host;
                } else if (parent.tagName.toLowerCase() === 'fake-shadow-root') {
                    parent = parent.parentNode;
                }
                this.host = parent;
            }
        };
    var MarkSelectable = require('eoo').create(require('k-component/Action'), overrides);
    return MarkSelectable;
});