define('k-component-element/KList', [
    'require',
    'k-component/component!k-component-element/k-list',
    'fc-core/oo',
    'k-component/Action'
], function (require) {
    require('k-component/component!k-component-element/k-list');
    var overrides = {
            initialize: function () {
                this.content.innerHTML = [
                    '<!-- for: ${list} as ${item}, ${index} -->',
                    this.content.innerHTML,
                    '<!-- /for -->'
                ].join('\n');
            },
            bindEvents: function () {
                var me = this;
                me.model.on('change:list', me.render, me);
            },
            attributes: {},
            setList: function (list) {
                this.model.set('list', list);
            },
            getList: function () {
                return this.model.get('list');
            },
            dispose: function () {
                this.$super(arguments);
            }
        };
    var KList = require('fc-core/oo').derive(require('k-component/Action'), overrides);
    return KList;
});