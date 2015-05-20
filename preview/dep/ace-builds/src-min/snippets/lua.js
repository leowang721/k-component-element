/*! @2015 Leo Wang. All Rights Reserved */
define('ace/snippets/lua', [
    'require',
    'exports',
    'module'
], function (e, t, n) {
    'use strict';
    t.snippetText = 'snippet #!\n\t#!/usr/bin/env lua\n\t$1\nsnippet local\n\tlocal ${1:x} = ${2:1}\nsnippet fun\n\tfunction ${1:fname}(${2:...})\n\t\t${3:-- body}\n\tend\nsnippet for\n\tfor ${1:i}=${2:1},${3:10} do\n\t\t${4:print(i)}\n\tend\nsnippet forp\n\tfor ${1:i},${2:v} in pairs(${3:table_name}) do\n\t   ${4:-- body}\n\tend\nsnippet fori\n\tfor ${1:i},${2:v} in ipairs(${3:table_name}) do\n\t   ${4:-- body}\n\tend\n', t.scope = 'lua';
});