define('k-component/component', [
    'require',
    'exports',
    'module',
    'k-component/config',
    'k-component/registry'
], function (require, exports, module) {
    'use strict';
    var config = require('k-component/config');
    var registry = require('k-component/registry');
    return {
        load: function (resourceId, req, load) {
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.open('GET', req.toUrl(resourceId + '.' + config.LOADER_FILE_SUFFIX), true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var source = xhr.responseText;
                        registry.registerFromHTML(source);
                        load(source);
                    }
                    xhr.onreadystatechange = new Function();
                    xhr = null;
                }
            };
            xhr.send(null);
        }
    };
});