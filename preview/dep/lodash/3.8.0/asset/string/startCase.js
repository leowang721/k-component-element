define('lodash/string/startCase', ['../internal/createCompounder'], function (createCompounder) {
    var startCase = createCompounder(function (result, word, index) {
            return result + (index ? ' ' : '') + (word.charAt(0).toUpperCase() + word.slice(1));
        });
    return startCase;
});