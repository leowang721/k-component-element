define('lodash/string/kebabCase', ['../internal/createCompounder'], function (createCompounder) {
    var kebabCase = createCompounder(function (result, word, index) {
            return result + (index ? '-' : '') + word.toLowerCase();
        });
    return kebabCase;
});