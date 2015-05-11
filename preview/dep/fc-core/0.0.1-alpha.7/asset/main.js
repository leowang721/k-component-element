define('fc-core/main', [
    'require',
    './aop',
    './assert',
    './oo',
    './setImmediate',
    'etpl',
    './util',
    './extension/underscore'
], function (require) {
    'use strict';
    var fc = {
            version: '0.0.1.alpha.7',
            aop: require('./aop'),
            assert: require('./assert'),
            oo: require('./oo'),
            setImmediate: require('./setImmediate'),
            tpl: require('etpl'),
            util: require('./util')
        };
    fc.tpl.config({ namingConflict: 'ignore' });
    require('./extension/underscore').activate();
    return fc;
});

define('fc-core', ['fc-core/main'], function ( main ) { return main; });