define('lodash/string/repeat', [
    '../internal/baseToString',
    '../internal/root'
], function (baseToString, root) {
    var floor = Math.floor;
    var nativeIsFinite = root.isFinite;
    function repeat(string, n) {
        var result = '';
        string = baseToString(string);
        n = +n;
        if (n < 1 || !string || !nativeIsFinite(n)) {
            return result;
        }
        do {
            if (n % 2) {
                result += string;
            }
            n = floor(n / 2);
            string += string;
        } while (n);
        return result;
    }
    return repeat;
});