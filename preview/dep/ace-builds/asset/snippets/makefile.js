/*! @2015 Leo Wang. All Rights Reserved */
define('ace/snippets/makefile', [
    'require',
    'exports',
    'module'
], function (require, exports, module) {
    'use strict';
    exports.snippetText = 'snippet ifeq\n\tifeq (${1:cond0},${2:cond1})\n\t\t${3:code}\n\tendif\n';
    exports.scope = 'makefile';
});