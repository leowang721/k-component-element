define('fc-storage/localStorage', [
    'require',
    'underscore',
    './util',
    './memory',
    'fc-core/EventTarget'
], function (require) {
    'use strict';
    var _ = require('underscore');
    var util = require('./util');
    function getStorage() {
        if (typeof window.localStorage === 'object') {
            return window.localStorage;
        } else if (typeof window.globalStorage === 'object') {
            return window.globalStorage[window.location.host];
        }
        return null;
    }
    var storage = getStorage();
    if (!storage) {
        var fallback = require('./memory').createInstance();
        fallback.supported = false;
        return fallback;
    }
    var storageCtrl = { supported: true };
    _.extend(storageCtrl, util.getExtendedStorageMethods(storage));
    require('fc-core/EventTarget').enable(storageCtrl);
    return storageCtrl;
});