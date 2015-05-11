define('lodash/array/initial', ['./dropRight'], function (dropRight) {
    function initial(array) {
        return dropRight(array, 1);
    }
    return initial;
});