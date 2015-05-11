define('ace/snippets/xquery', [
    'require',
    'exports',
    'module'
], function (e, t, n) {
    'use strict';
    t.snippetText = 'snippet for\n\tfor $${1:item} in ${2:expr}\nsnippet return\n\treturn ${1:expr}\nsnippet import\n\timport module namespace ${1:ns} = "${2:http://www.example.com/}";\nsnippet some\n\tsome $${1:varname} in ${2:expr} satisfies ${3:expr}\nsnippet every\n\tevery $${1:varname} in ${2:expr} satisfies ${3:expr}\nsnippet if\n\tif(${1:true}) then ${2:expr} else ${3:true}\nsnippet switch\n\tswitch(${1:"foo"})\n\tcase ${2:"foo"}\n\treturn ${3:true}\n\tdefault return ${4:false}\nsnippet try\n\ttry { ${1:expr} } catch ${2:*} { ${3:expr} }\nsnippet tumbling\n\tfor tumbling window $${1:varname} in ${2:expr}\n\tstart at $${3:start} when ${4:expr}\n\tend at $${5:end} when ${6:expr}\n\treturn ${7:expr}\nsnippet sliding\n\tfor sliding window $${1:varname} in ${2:expr}\n\tstart at $${3:start} when ${4:expr}\n\tend at $${5:end} when ${6:expr}\n\treturn ${7:expr}\nsnippet let\n\tlet $${1:varname} := ${2:expr}\nsnippet group\n\tgroup by $${1:varname} := ${2:expr}\nsnippet order\n\torder by ${1:expr} ${2:descending}\nsnippet stable\n\tstable order by ${1:expr}\nsnippet count\n\tcount $${1:varname}\nsnippet ordered\n\tordered { ${1:expr} }\nsnippet unordered\n\tunordered { ${1:expr} }\nsnippet treat \n\ttreat as ${1:expr}\nsnippet castable\n\tcastable as ${1:atomicType}\nsnippet cast\n\tcast as ${1:atomicType}\nsnippet typeswitch\n\ttypeswitch(${1:expr})\n\tcase ${2:type}  return ${3:expr}\n\tdefault return ${4:expr}\nsnippet var\n\tdeclare variable $${1:varname} := ${2:expr};\nsnippet fn\n\tdeclare function ${1:ns}:${2:name}(){\n\t${3:expr}\n\t};\nsnippet module\n\tmodule namespace ${1:ns} = "${2:http://www.example.com}";\n', t.scope = 'xquery';
});