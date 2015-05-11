define('lodash/utility/constant', [], function () {
    function constant(value) {
        return function () {
            return value;
        };
    }
    return constant;
});