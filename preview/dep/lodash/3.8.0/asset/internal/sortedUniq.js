/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/internal/sortedUniq",[],function(){function e(e,t){for(var n,r=-1,i=e.length,o=-1,a=[];++r<i;){var u=e[r],s=t?t(u,r,e):u;if(!r||n!==s)n=s,a[++o]=u}return a}return e});