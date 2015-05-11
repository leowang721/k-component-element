define('lodash/utility/uniqueId', ['../internal/baseToString'], function (baseToString) {
    var idCounter = 0;
    function uniqueId(prefix) {
        var id = ++idCounter;
        return baseToString(prefix) + id;
    }
    return uniqueId;
});