define('lodash/internal/createPadDir', [
    './baseToString',
    './createPadding'
], function (baseToString, createPadding) {
    function createPadDir(fromRight) {
        return function (string, length, chars) {
            string = baseToString(string);
            return (fromRight ? string : '') + createPadding(string, length, chars) + (fromRight ? '' : string);
        };
    }
    return createPadDir;
});