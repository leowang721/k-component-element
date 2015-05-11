void function (define) {
    define('eoo/main', [
        'require',
        './oo',
        './defineAccessor'
    ], function (require) {
        var oo = require('./oo');
        oo.defineAccessor = require('./defineAccessor');
        return oo;
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
});

define('eoo', ['eoo/main'], function ( main ) { return main; });