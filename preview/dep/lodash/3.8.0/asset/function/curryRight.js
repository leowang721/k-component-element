define('lodash/function/curryRight', ['../internal/createCurry'], function (createCurry) {
    var CURRY_RIGHT_FLAG = 16;
    var curryRight = createCurry(CURRY_RIGHT_FLAG);
    curryRight.placeholder = {};
    return curryRight;
});