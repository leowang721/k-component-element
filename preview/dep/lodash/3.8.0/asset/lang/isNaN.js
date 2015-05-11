define('lodash/lang/isNaN', ['./isNumber'], function (isNumber) {
    function isNaN(value) {
        return isNumber(value) && value != +value;
    }
    return isNaN;
});