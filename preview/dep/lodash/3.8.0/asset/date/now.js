/*! @2015 Leo Wang. All Rights Reserved */
define("lodash/date/now",["../lang/isNative"],function(e){var t=e(t=Date.now)&&t,n=t||function(){return(new Date).getTime()};return n});