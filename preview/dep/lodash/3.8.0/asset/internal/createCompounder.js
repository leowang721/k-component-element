define('lodash/internal/createCompounder', [
    '../string/deburr',
    '../string/words'
], function (deburr, words) {
    function createCompounder(callback) {
        return function (string) {
            var index = -1, array = words(deburr(string)), length = array.length, result = '';
            while (++index < length) {
                result = callback(result, array[index], index);
            }
            return result;
        };
    }
    return createCompounder;
});