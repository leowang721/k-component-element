define('fc-storage/sessionStorage', [
    'require',
    'underscore',
    'fc-core',
    './util',
    './memory'
], function (require) {
    'use strict';
    var _ = require('underscore');
    var fc = require('fc-core');
    var util = require('./util');
    var storage = window.sessionStorage;
    if (!storage) {
        var fallback = require('./memory').createInstance();
        fallback.supported = false;
        return fallback;
    }
    var isIE8 = typeof window.document.createElement !== 'function';
    var storageCtrl = {
            supported: true,
            isIE8: isIE8
        };
    _.extend(storageCtrl, util.getExtendedStorageMethods(storage));
    fc.EventTarget.enable(storageCtrl);
    return storageCtrl;
});