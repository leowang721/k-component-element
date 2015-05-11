define('lodash/string/camelCase', ['../internal/createCompounder'], function (createCompounder) {
    var camelCase = createCompounder(function (result, word, index) {
            word = word.toLowerCase();
            return result + (index ? word.charAt(0).toUpperCase() + word.slice(1) : word);
        });
    return camelCase;
});