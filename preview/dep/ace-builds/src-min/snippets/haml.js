define('ace/snippets/haml', [
    'require',
    'exports',
    'module'
], function (e, t, n) {
    'use strict';
    t.snippetText = 'snippet t\n\t%table\n\t\t%tr\n\t\t\t%th\n\t\t\t\t${1:headers}\n\t\t%tr\n\t\t\t%td\n\t\t\t\t${2:headers}\nsnippet ul\n\t%ul\n\t\t%li\n\t\t\t${1:item}\n\t\t%li\nsnippet =rp\n\t= render :partial => \'${1:partial}\'\nsnippet =rpl\n\t= render :partial => \'${1:partial}\', :locals => {}\nsnippet =rpc\n\t= render :partial => \'${1:partial}\', :collection => @$1\n\n', t.scope = 'haml';
});