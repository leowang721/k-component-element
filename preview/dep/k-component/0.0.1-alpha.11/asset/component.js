/*! @2015 Leo Wang. All Rights Reserved */
define("k-component/component",["require","exports","module","k-component/config","k-component/registry"],function(require){"use strict";var e=require("k-component/config"),t=require("k-component/registry");return{load:function(n,r,i){var o=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");o.open("GET",r.toUrl(n+"."+e.LOADER_FILE_SUFFIX),!0),o.onreadystatechange=function(){if(4===o.readyState){if(o.status>=200&&o.status<300){var e=o.responseText;t.registerFromHTML(e),i(e)}o.onreadystatechange=new Function,o=null}},o.send(null)}}});