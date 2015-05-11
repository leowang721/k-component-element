define('fc-storage/main', ['require'], function (require) {
    'use strict';
    var storage = { version: '0.0.1-alpha.6' };
    return storage;
});

define('fc-storage', ['fc-storage/main'], function ( main ) { return main; });