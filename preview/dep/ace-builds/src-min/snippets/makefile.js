/*! @2015 Leo Wang. All Rights Reserved */
define('ace/snippets/makefile', [
    'require',
    'exports',
    'module'
], function (e, t, n) {
    'use strict';
    t.snippetText = 'snippet ifeq\n\tifeq (${1:cond0},${2:cond1})\n\t\t${3:code}\n\tendif\n', t.scope = 'makefile';
});