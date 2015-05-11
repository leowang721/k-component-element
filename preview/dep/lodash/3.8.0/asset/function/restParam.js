define('lodash/function/restParam', [], function () {
    var undefined;
    var FUNC_ERROR_TEXT = 'Expected a function';
    var nativeMax = Math.max;
    function restParam(func, start) {
        if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
        }
        start = nativeMax(start === undefined ? func.length - 1 : +start || 0, 0);
        return function () {
            var args = arguments, index = -1, length = nativeMax(args.length - start, 0), rest = Array(length);
            while (++index < length) {
                rest[index] = args[start + index];
            }
            switch (start) {
            case 0:
                return func.call(this, rest);
            case 1:
                return func.call(this, args[0], rest);
            case 2:
                return func.call(this, args[0], args[1], rest);
            }
            var otherArgs = Array(start + 1);
            index = -1;
            while (++index < start) {
                otherArgs[index] = args[index];
            }
            otherArgs[start] = rest;
            return func.apply(this, otherArgs);
        };
    }
    return restParam;
});