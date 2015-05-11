define('lodash/string/capitalize', ['../internal/baseToString'], function (baseToString) {
    function capitalize(string) {
        string = baseToString(string);
        return string && string.charAt(0).toUpperCase() + string.slice(1);
    }
    return capitalize;
});