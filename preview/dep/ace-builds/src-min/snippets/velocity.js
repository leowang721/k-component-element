define('ace/snippets/velocity', [
    'require',
    'exports',
    'module'
], function (e, t, n) {
    'use strict';
    t.snippetText = '# macro\nsnippet #macro\n\t#macro ( ${1:macroName} ${2:\\$var1, [\\$var2, ...]} )\n\t\t${3:## macro code}\n\t#end\n# foreach\nsnippet #foreach\n\t#foreach ( ${1:\\$item} in ${2:\\$collection} )\n\t\t${3:## foreach code}\n\t#end\n# if\nsnippet #if\n\t#if ( ${1:true} )\n\t\t${0}\n\t#end\n# if ... else\nsnippet #ife\n\t#if ( ${1:true} )\n\t\t${2}\n\t#else\n\t\t${0}\n\t#end\n#import\nsnippet #import\n\t#import ( "${1:path/to/velocity/format}" )\n# set\nsnippet #set\n\t#set ( $${1:var} = ${0} )\n', t.scope = 'velocity', t.includeScopes = [
        'html',
        'javascript',
        'css'
    ];
});