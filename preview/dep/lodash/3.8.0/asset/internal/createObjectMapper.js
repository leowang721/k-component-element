/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/internal/createObjectMapper",["./baseCallback","./baseForOwn"],function(e,t){function n(n){return function(r,i,o){var a={};return i=e(i,o,3),t(r,function(e,t,r){var o=i(e,t,r);t=n?o:t,e=n?e:o,a[t]=e}),a}}return n});