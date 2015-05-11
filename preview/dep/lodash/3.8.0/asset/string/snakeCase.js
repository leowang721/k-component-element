define('lodash/string/snakeCase', ['../internal/createCompounder'], function (createCompounder) {
    var snakeCase = createCompounder(function (result, word, index) {
            return result + (index ? '_' : '') + word.toLowerCase();
        });
    return snakeCase;
});