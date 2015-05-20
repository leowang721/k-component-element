/*! @2015 Leo Wang. All Rights Reserved */
define('ace/snippets/snippets', [
    'require',
    'exports',
    'module'
], function (require, exports, module) {
    'use strict';
    exports.snippetText = '# snippets for making snippets :)\nsnippet snip\n\tsnippet ${1:trigger}\n\t\t${2}\nsnippet msnip\n\tsnippet ${1:trigger} ${2:description}\n\t\t${3}\nsnippet v\n\t{VISUAL}\n';
    exports.scope = 'snippets';
});