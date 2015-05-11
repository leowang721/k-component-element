void function (define) {
    define('promise/main', [
        'require',
        './Promise',
        './enhance',
        './then',
        './hook'
    ], function (require) {
        var Promise = require('./Promise');
        var enhance = require('./enhance');
        var then = require('./then');
        var hook = require('./hook');
        return hook(then(enhance(Promise)));
    });
}(typeof define === 'function' && define.amd ? define : function (factory) {
    module.exports = factory(require);
}, this);

define('promise', ['promise/main'], function ( main ) { return main; });