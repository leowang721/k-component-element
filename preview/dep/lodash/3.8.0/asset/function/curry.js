define('lodash/function/curry', ['../internal/createCurry'], function (createCurry) {
    var CURRY_FLAG = 8;
    var curry = createCurry(CURRY_FLAG);
    curry.placeholder = {};
    return curry;
});