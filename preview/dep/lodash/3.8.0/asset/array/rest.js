define('lodash/array/rest', ['./drop'], function (drop) {
    function rest(array) {
        return drop(array, 1);
    }
    return rest;
});